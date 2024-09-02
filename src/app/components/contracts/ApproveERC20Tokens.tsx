"use client";
import { ierc20Abi } from "@/app/lib/contracts/abis";
import { ERC20Token } from "@/app/lib/interfaces";
import { useContractContext } from "@/context/contractContext";
import { RefetchOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface ApproveERC20TokensProps {
  token: ERC20Token;
  marketAllowance?: bigint;
  amount: bigint;
  refetch: (options?: RefetchOptions) => Promise<unknown>;
}

export default function ApproveERC20Tokens({
  token,
  amount,
  marketAllowance,
  refetch,
}: ApproveERC20TokensProps) {
  const {
    data: {
      market: { id: marketAddress },
    },
  } = useContractContext();

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [amountToAprove, setAmountToAprove] = useState<bigint>(amount);

  useEffect(() => {
    setAmountToAprove(amount);
  }, [amount]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const amount = amountToAprove + (marketAllowance ?? 0n);

    writeContract({
      address: token.address,
      abi: ierc20Abi,
      functionName: "approve",
      args: [marketAddress, amount],
    });
  }

  useEffect(() => {
    if (isConfirmed == true) {
      refetch();
    }
  }, [isConfirmed, refetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    try {
      setAmountToAprove(parseUnits(inputValue, parseInt(token.decimals)));
    } catch (error) {
      console.log("not valid bigint value: ", error);
    }
  };

  return (
    <div className="rounded py-4 flex flex-col gap-y-4">
      <h1 className="text-xl">Approve {token.symbol} tokens </h1>
      <p className="text-yellow-500">We will approve with 5% slip page</p>
      <form
        onSubmit={submit}
        className="rounded flex flex-col gap-y-2 direct-children:p-2 direct-children:rounded"
      >
        <input
          title="Amount to approve"
          className="bg-gray-300"
          name="amount"
          placeholder="Amount to approve"
          required
          type="text"
          value={formatUnits(amountToAprove, parseInt(token.decimals))}
          onChange={handleInputChange}
        />
        <button className="bg-seabrick-green" type="submit">
          {isPending ? "Confirming..." : "Approve"}
        </button>

        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
      </form>
    </div>
  );
}
