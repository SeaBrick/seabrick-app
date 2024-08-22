"use client";

import { addresses } from "@/app/lib/contracts";
import IMarket from "@/app/lib/contracts/abis/IMarket.json";
import { getAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function Market() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: owner } = useReadContract({
    abi: IMarket,
    address: getAddress(addresses.SeabrickMarket),
    functionName: "owner",
  });

  return (
    <div className="w-full flex gap-x-4">
      <div>Owner: {owner?.toString()}</div>
    </div>
  );
}
