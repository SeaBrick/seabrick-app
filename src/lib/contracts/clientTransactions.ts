"use client";
import { toast } from "react-toastify";
import { Config } from "wagmi";
import {
  simulateContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { ierc20Abi } from "./abis";
import { type Address, BaseError as ViemBaseError } from "viem";
import { BaseError as WagmiBaseError } from "@wagmi/core";

interface ApproveTokensOptions {
  tokenAddress: Address;
  marketAddress: Address;
  amount: bigint;
}

export async function approveTokens(
  config: Config,
  options: ApproveTokensOptions
) {
  const { tokenAddress, marketAddress, amount } = options;

  const { request } = await simulateContract(config, {
    address: tokenAddress,
    abi: ierc20Abi,
    functionName: "approve",
    args: [marketAddress, amount],
  });

  // Get the tx
  const txHash = await writeContract(config, request);

  // Wait for the transaction receipt
  const resp = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 2,
  });

  if (resp.status == "success") {
    return "Tokens approved";
  } else {
    throw new Error("Transaction failed");
  }
}

// Toastify wrapper function
export async function toastifyPromiseWrapper(fn: () => Promise<string>) {
  return toast.promise(fn(), {
    pending: "Waiting for the transaction...",
    success: {
      render({ data }) {
        return data;
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
