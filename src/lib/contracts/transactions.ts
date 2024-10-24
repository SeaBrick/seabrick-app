"use server";

import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
  isHex,
  PublicClient,
  TransactionReceipt,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { iSeabrickAbi } from "@/lib/contracts/abis";
import { addresses } from ".";
import { createClient } from "../supabase/server";

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
      const resp = await createClient().from("wallet_nonces").insert({
        nonce,
        address,
      });

      console.log("Response when adding `wallet_nonces`: ", resp);
    }

    return nonce;
  }

  if (resp.data.nonce > nonce) {
    return resp.data.nonce;
  }

  return nonce;
}

export async function mintSeabrickTokens(toAddress: Address, amount: number) {
  const client = getClient();
  const walletClient = getWalletServerAccount(client);
  const nonce = await getNonceWallet(walletClient.account.address, client);

  const abi = iSeabrickAbi;
  let receipt: TransactionReceipt | undefined = undefined;

  try {
    const txHash = await walletClient.writeContract({
      address: addresses.SeabrickNFT,
      abi: abi,
      functionName: "mintBatch",
      args: [toAddress, amount],
      nonce: nonce,
    });
    receipt = await client.waitForTransactionReceipt({ hash: txHash });
  } catch (error) {
    console.log("failed: ", error);
    return false;
  }

  if (receipt && receipt.status === "success") {
    await createClient()
      .from("wallet_nonces")
      .update({
        nonce: nonce + 1,
        address: walletClient.account.address,
      })
      .eq("address", walletClient.account.address);

    return true;
  } else {
    return false;
  }
}
