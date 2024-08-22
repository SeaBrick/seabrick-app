"use client";

import { addresses } from "@/app/lib/contracts";
import IERC20 from "@/app/lib/contracts/abis/IERC20.json";
import { getAddress, formatUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

function MintTokens() {
  const { data: hash, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = formData.get("amount") as string;
    const toAddress = formData.get("to") as string;

    writeContract({
      address: getAddress(addresses.ERC20),
      abi: IERC20,
      functionName: "mint",
      args: [getAddress(toAddress), BigInt(amount)],
    });
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-2"
    >
      <input
        className="bg-gray-300 p-2 rounded"
        name="amount"
        placeholder="Amount"
        required
      />
      <input
        className="bg-gray-300 p-2 rounded"
        name="to"
        placeholder="Address destinatary"
        required
      />
      <button className="bg-green-400 p-2" type="submit">
        Mint
      </button>

      {hash && <div>Transaction Hash: {hash}</div>}
    </form>
  );
}

export default function Market() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: decimals } = useReadContract({
    abi: IERC20,
    address: getAddress(addresses.ERC20),
    functionName: "decimals",
  });

  const { data: totalSupply } = useReadContract({
    abi: IERC20,
    address: getAddress(addresses.ERC20),
    functionName: "totalSupply",
  });

  const { data: balance } = useReadContract({
    abi: IERC20,
    address: getAddress(addresses.ERC20),
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <>
      <div className="w-full flex flex-col gap-y-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
        <div>
          Wallet balance:{" "}
          {formatUnits(
            BigInt(balance?.toString() || "0"),
            Number(decimals?.toString() || 1)
          ).toString()}{" "}
          ({decimals?.toString() || 1} decimals)
        </div>

        <div>
          Total supply:{" "}
          {formatUnits(
            BigInt(totalSupply?.toString() || "0"),
            Number(decimals?.toString() || 1)
          ).toString()}{" "}
          ({decimals?.toString() || 1} decimals)
        </div>
      </div>
      <div>
        <MintTokens />
      </div>
    </>
  );
}
