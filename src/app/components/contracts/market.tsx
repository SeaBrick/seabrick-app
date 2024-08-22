"use client";

import { addresses } from "@/app/lib/contracts";
import IMarket from "@/app/lib/contracts/abis/IMarket.json";
import { getAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const marketData = {
  NAMES: [
    "0x62ddc8c5ffbd077b5a28e92efd10abcc58e66fb2a326401f0efd02e173ac1777",
    "0xb45d52f2002a2abc1f204eb800af7cbf074250de1f754f35254efca06f7b3256",
  ],
  AGGREGATORS: [
    "0xd30e2101a97dcbaebcbc04f14c3f624e67a35165",
    "0x0153002d20b96532c639313c2d54c3da09109309",
  ],
  TOKENS: [
    "0x92d05c45ac5b44ae6ac5def0bb231bc8fbdcf43a",
    "0x7f6f413ce5b19bd7e82f811296cac78477fc607b",
  ],
};

function InitMarket() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // TODO: Add some thing of checkers for the inputs arrays or better ui
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const price = formData.get("price") as string;
    const nftAddress = formData.get("nftAddress") as string;

    const rawNames = formData.get("names") as string;
    const names = rawNames.replace("[", "").replace("]", "").split(",");

    const rawAgregators = formData.get("agregators") as string;
    const agregators = rawAgregators
      .replace("[", "")
      .replace("]", "")
      .split(",");

    const rawTokens = formData.get("tokens") as string;
    const tokens = rawTokens.replace("[", "").replace("]", "").split(",");

    writeContract({
      address: getAddress(addresses.SeabrickMarket),
      abi: IMarket,
      functionName: "initialization",
      args: [BigInt(price), getAddress(nftAddress), names, agregators, tokens],
    });
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-y-2"
    >
      <input
        className="bg-gray-300 p-2 rounded"
        name="price"
        placeholder="USD price"
        required
      />
      <input
        className="bg-gray-300 p-2 rounded"
        name="nftAddress"
        placeholder="Seabrick NFT address"
        required
        defaultValue={addresses.SeabrickNFT}
      />
      <input
        className="bg-gray-300 p-2 rounded"
        name="names"
        placeholder="Names hashed keccack256"
        required
        defaultValue={marketData.NAMES.toString()}
      />
      <input
        className="bg-gray-300 p-2 rounded"
        name="agregators"
        placeholder="Chainlink oracles agregators"
        required
        defaultValue={marketData.AGGREGATORS.toString()}
      />
      <input
        className="bg-gray-300 p-2 rounded"
        name="tokens"
        placeholder="Payment tokens for each typo of oracle"
        required
        defaultValue={marketData.TOKENS.toString()}
      />
      <button disabled={isPending} className="bg-green-400 p-2" type="submit">
        {isPending ? "Confirming..." : "Init contract"}
      </button>

      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </form>
  );
}

export default function Market() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: owner } = useReadContract({
    abi: IMarket,
    address: getAddress(addresses.SeabrickMarket),
    functionName: "owner",
  });

  return (
    <>
      <div>
        <InitMarket />
      </div>
    </>
  );
}
