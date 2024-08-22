"use client";

import { addresses } from "@/app/lib/contracts";
import ISeabrick from "@/app/lib/contracts/abis/ISeabrick.json";
import { getAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

function InitSeabrick() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const ownerAddress = formData.get("owner") as string;

    writeContract({
      address: getAddress(addresses.SeabrickNFT),
      abi: ISeabrick,
      functionName: "initialization",
      args: [getAddress(ownerAddress)],
    });
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-2"
    >
      <input
        className="bg-gray-300 p-2 rounded"
        name="owner"
        placeholder="Address owner"
        required
        defaultValue={addresses.SeabrickMarket}
      />
      <button disabled={isPending} className="bg-green-400 p-2" type="submit">
        {isPending ? "Confirming..." : "Init contract"}
      </button>

      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </form>
  );
}

export default function Seabrick() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: owner } = useReadContract({
    abi: ISeabrick,
    address: getAddress(addresses.SeabrickNFT),
    functionName: "owner",
  });

  return (
    <>
      <div className="w-full flex flex-col gap-y-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
        <div>Owner: {owner?.toString()}</div>
      </div>
      <div>
        <InitSeabrick />
      </div>
    </>
  );
}
