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
  let nonce = 0;

  for (let i = 0; i < 5; i++) {
    const aux = await client.getTransactionCount({
      address,
      blockTag: "pending",
    });

    if (aux > nonce) {
      nonce = aux;
    }
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
    return false;
  }

  if (receipt && receipt.status === "success") {
    return true;
  } else {
    return false;
  }
}
