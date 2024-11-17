"use client";
import { toast } from "react-toastify";
import { Config } from "wagmi";
import {
  simulateContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { ierc20Abi, iMarketAbi } from "./abis";
import { type Address, Hex, BaseError as ViemBaseError } from "viem";
import { BaseError as WagmiBaseError } from "@wagmi/core";

interface ApproveTokensOptions {
  tokenAddress: Address;
  marketAddress: Address;
  amount: bigint;
}
interface BuySeabrickOptions {
  marketAddress: Address;
  walletAddress: Address | undefined;
  agregatorName: Hex;
  quantity: number;
}

interface ToastifyPromiseReturn<T> {
  message: string;
  data: T;
}
interface TransactionData {
  txHash: Hex;
}

export async function approveTokens(
  config: Config,
  options: ApproveTokensOptions
): Promise<ToastifyPromiseReturn<TransactionData>> {
  const { tokenAddress, marketAddress, amount } = options;

  // Simulate the transaction to catch any early error
  const { request } = await simulateContract(config, {
    address: tokenAddress,
    abi: ierc20Abi,
    functionName: "approve",
    args: [marketAddress, amount],
  });

  // Send the tx
  const txHash = await writeContract(config, request);

  // Wait for the transaction receipt with 2 confirmations
  const resp = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 2,
  });

  if (resp.status == "success") {
    return { message: "Tokens approved", data: { txHash } };
  } else {
    throw new Error("Transaction failed");
  }
}

export async function buySeabrick(
  config: Config,
  options: BuySeabrickOptions
): Promise<ToastifyPromiseReturn<TransactionData>> {
  const { marketAddress, walletAddress, agregatorName, quantity } = options;

  if (!walletAddress) {
    throw new Error("No wallet address");
  }

  // Simulate the transaction to catch any early error
  const { request } = await simulateContract(config, {
    address: marketAddress,
    abi: iMarketAbi,
    functionName: "buy",
    args: [walletAddress, agregatorName, quantity],
  });

  // Send the tx
  const txHash = await writeContract(config, request);

  // Wait for the transaction receipt with 2 confirmations
  const resp = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 2,
  });

  if (resp.status == "success") {
    return { message: "Buy transaction complete", data: { txHash } };
  } else {
    throw new Error("Buy transaction failed");
  }
}

// Toastify wrapper function
export async function toastifyPromiseWrapper<T>(
  fn: () => Promise<ToastifyPromiseReturn<T>>
) {
  return toast.promise(fn(), {
    pending: "Waiting for the transaction...",
    success: {
      render({ data }) {
        return data.message;
      },
    },
    error: {
      render({ data: error }) {
        let errorMessage = "Unknown transaction error ";

        if (error instanceof ViemBaseError) {
          errorMessage = error.walk().message;
        } else {
          if (error instanceof WagmiBaseError) {
            errorMessage = error.shortMessage;
          } else if (error instanceof Error) {
            console.log(error);
            errorMessage = error.message;
          }
        }

        return errorMessage;
      },
    },
  });
}
