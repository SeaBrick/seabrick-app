"use client";

import { addresses } from "@/app/lib/contracts";
import ISeabrick from "@/app/lib/contracts/abis/ISeabrick.json";
import { getAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function Seabrick() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: owner } = useReadContract({
    abi: ISeabrick,
    address: getAddress(addresses.SeabrickNFT),
    functionName: "owner",
  });

  return (
    <div className="w-full flex gap-x-4">
      <div>Owner: {owner?.toString()}</div>
    </div>
  );
}
