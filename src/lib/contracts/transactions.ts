"use server";

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  isHex,
  parseEventLogs,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { iSeabrickAbi, iOwnershipAbi } from "@/lib/contracts/abis";
import { addresses } from ".";
import { createClient } from "../supabase/server";
import { appChains } from "@/config/chains";

import type { Address, PublicClient, TransactionReceipt } from "viem";
import type {
  MintSeabrickResp,
  TransferSeabrickResp,
} from "@/lib/interfaces/api";

// ERROR if this env is missing
const wallet_server_key = process.env.WALLET_SERVER_KEY;
if (!wallet_server_key) {
  throw new Error("Missing WALLET_SERVER_KEY value");
}

function getClient() {
  // Create an HTTP client for the desired chain
  return createPublicClient({
    chain: appChains[0],
    transport: http(),
  });
}

function getWalletServerAccount(client: PublicClient) {
  if (!wallet_server_key) {
    throw new Error("Missing WALLET_SERVER_KEY value");
  }

  if (!isHex(wallet_server_key)) {
    throw new Error("WALLET_SERVER_KEY is not a hex value");
  }

  const account = privateKeyToAccount(wallet_server_key);

  return createWalletClient({
    account,
    chain: appChains[0],
    transport: custom(client),
  });
}

async function getNonceWallet(
  address: Address,
  client: PublicClient
): Promise<number> {
  const nonce = await client.getTransactionCount({
    address,
    blockTag: "pending",
  });

  const resp = await createClient()
    .from("wallet_nonces")
    .select("nonce")
    .eq("address", address)
    .single();

  if (resp.error) {
    if (resp.error.code == "PGRST116") {
      await createClient().from("wallet_nonces").insert({
        nonce,
        address,
      });
    }

    return nonce;
  }

  return Math.max(resp.data.nonce || 0, nonce);
}

export async function increaseNonceWallet(
  address: Address,
  prevNonce: number,
  client: PublicClient = getClient()
) {
  // Check nonce only
  const checkNonce = await getNonceWallet(address, client);

  // Get the higher nonce:
  // - If `checkNonce` and `prevNonce + 1` are equal, all is ok
  // - If `checkNonce` is higher than `prevNonce + 1`, means that some
  //   transaction was not catched
  // - If `checkNonce` is lower than `prevNonce + 1` means that the RPC url is behind.
  const higherNonce = Math.max(checkNonce, prevNonce + 1);

  const { error } = await createClient()
    .from("wallet_nonces")
    .update({
      nonce: higherNonce,
    })
    .eq("address", address);

  if (error) {
    console.error("Increase DB nonce error: ", error);
  }
}

export async function mintSeabrickTokens(
  amount: number,
  toAddress?: Address
): Promise<MintSeabrickResp> {
  const client = getClient();
  const walletClient = getWalletServerAccount(client);
  const nonce = await getNonceWallet(walletClient.account.address, client);

  // If no `toAddress` defined, we use the minter address
  if (!toAddress) {
    toAddress = walletClient.account.address;
  }

  let receipt: TransactionReceipt | undefined = undefined;

  try {
    // We try to mint the tokens using the minter address
    const txHash = await walletClient.writeContract({
      address: addresses.SeabrickNFT,
      abi: iSeabrickAbi,
      functionName: "mintBatch",
      args: [toAddress, amount],
      nonce: nonce,
    });

    // We wait for the tx receipts
    receipt = await client.waitForTransactionReceipt({ hash: txHash });
  } catch (error) {
    // Tokens were not minted
    console.error("Failed to mint the tokens: \n", error);
    return { isMinted: false };
  }

  // if we have a receipt, we sent the transaction
  // Even if it was reverted or no, the nonce is increased
  if (receipt) {
    // Increase the nonce wallet on the DB
    await increaseNonceWallet(walletClient.account.address, nonce, client);
  }

  if (receipt && receipt.status === "success") {
    const logs = parseEventLogs({
      abi: iSeabrickAbi,
      eventName: "Transfer",
      logs: receipt.logs,
    });

    const ids = logs.map((log_) => log_.args.tokenId.toString());

    return { isMinted: true, txHash: receipt.transactionHash, ids };
  } else {
    return { isMinted: false };
  }
}

export async function getContractsOwner(): Promise<Address> {
  const client = getClient();

  const ownerAddress = await client.readContract({
    address: addresses.Ownership,
    abi: iOwnershipAbi,
    functionName: "owner",
  });

  return ownerAddress;
}

export async function transferFromVault(
  tokenIds: bigint[],
  toAddress: Address
): Promise<TransferSeabrickResp> {
  const client = getClient();
  const walletClient = getWalletServerAccount(client);
  const nonce = await getNonceWallet(walletClient.account.address, client);

  let receipt: TransactionReceipt | undefined = undefined;

  try {
    // We transfer the tokens from the vault client address
    const txHash = await walletClient.writeContract({
      address: addresses.SeabrickNFT,
      abi: iSeabrickAbi,
      functionName: "transferBatch",
      args: [walletClient.account.address, toAddress, tokenIds],
      nonce: nonce,
    });

    // We wait for the tx receipts
    receipt = await client.waitForTransactionReceipt({ hash: txHash });
  } catch (error) {
    // Tokens were not minted
    console.error("Failed to transfer the tokens: \n", error);
    return { isTransfer: false };
  }

  // if we have a receipt, we sent the transaction
  // Even if it was reverted or no, the nonce is increased
  if (receipt) {
    // Increase the nonce wallet on the DB
    await increaseNonceWallet(walletClient.account.address, nonce, client);
  }

  if (receipt && receipt.status === "success") {
    return { isTransfer: true, txHash: receipt.transactionHash };
  } else {
    return { isTransfer: false };
  }
}
