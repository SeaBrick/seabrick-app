"use server";

import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
  isHex,
  parseEventLogs,
  PublicClient,
  TransactionReceipt,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { iSeabrickAbi, iMarketAbi } from "@/lib/contracts/abis";
import { addresses } from ".";
import { createClient } from "../supabase/server";
import { MintSeabrickResp } from "../interfaces/api";

// ERROR if this env is missing
const wallet_server_key = process.env.WALLET_SERVER_KEY;
if (!wallet_server_key) {
  throw new Error("Missing WALLET_SERVER_KEY value");
}

// Defining arbitrum sepolia with custom rpc url
const arbitrumSepolia = defineChain({
  id: 421_614,
  name: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "Arbitrum Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.ARBITRUM_SEPOLIA_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: "Arbiscan",
      url: "https://sepolia.arbiscan.io",
      apiUrl: "https://api-sepolia.arbiscan.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 81930,
    },
  },
  testnet: true,
});

function getClient() {
  // Create an HTTP client for the desired chain
  return createPublicClient({
    chain: arbitrumSepolia, // Use your desired chain, like mainnet or testnet
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
    chain: arbitrumSepolia,
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

  if (receipt && receipt.status === "success") {
    // Increase the nonce wallet on the DB
    await increaseNonceWallet(walletClient.account.address, nonce, client);

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

// TODO: Changes when new ownership logic for contracts
export async function getContractsOwner(): Promise<Address> {
  const client = getClient();

  const address1 = await client.readContract({
    address: addresses.SeabrickNFT,
    abi: iSeabrickAbi,
    functionName: "owner",
  });

  const address2 = await client.readContract({
    address: addresses.SeabrickMarket,
    abi: iMarketAbi,
    functionName: "owner",
  });

  if (address1.toLocaleLowerCase() !== address2.toLowerCase()) {
    throw new Error("Mismatch owner between contracts");
  }

  return address1;
}

export async function transferFromVault(
  tokenId: string,
  toAddress: Address
): Promise<any> {
  const client = getClient();
  const walletClient = getWalletServerAccount(client);
  const nonce = await getNonceWallet(walletClient.account.address, client);

  // let receipt: TransactionReceipt | undefined = undefined;

  try {
    // We try to mint the tokens using the minter address
    // const txHash = await walletClient.writeContract({
    //   address: addresses.SeabrickNFT,
    //   abi: iSeabrickAbi,
    //   functionName: "safeTransferFrom",
    //   args: [toAddress, amount],
    //   nonce: nonce,
    // });
    // We wait for the tx receipts
    // receipt = await client.waitForTransactionReceipt({ hash: txHash });
  } catch (error) {
    // Tokens were not minted
    console.error("Failed to mint the tokens: \n", error);
    return { isMinted: false };
  }
}
