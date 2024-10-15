import { useContractContext } from "@/context/contractContext";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { iSeabrickAbi } from "@/lib/contracts/abis";
import { getAddress } from "viem";

interface TokenPanelProps {
  isNFTContractOwner: boolean;
  isMinter: boolean;
}
export default function TokenPanel({
  isNFTContractOwner: _,
  isMinter,
}: TokenPanelProps) {
  const {
    data: {
      seabrick: { id: nftAddress },
    },
  } = useContractContext();

  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 4,
    });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const toAddress = getAddress(formData.get("toAddress") as string);

    await writeContractAsync({
      address: nftAddress,
      abi: iSeabrickAbi,
      functionName: "mint",
      args: [toAddress],
    });
  }

  return (
    <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4">
      <p className="text-2xl font-bold">Seabrick panel</p>

      <div className="flex flex-col gap-y-4 bg-seabrick-blue rounded p-4 text-white divide-y-2 divide-white">
        {isMinter && (
          <div className="first:pt-0 pt-4 flex flex-col gap-y-4">
            <p>Mint a new token</p>
            <form
              onSubmit={submit}
              className="rounded flex flex-col gap-y-2 direct-children:p-2 direct-children:rounded"
            >
              <input
                className="bg-gray-300 text-black"
                name="toAddress"
                placeholder="Destinatary of the token"
                required
              />
              <button
                disabled={isPending || isConfirming}
                className="bg-seabrick-green p-2 text-white disabled:bg-slate-400"
                type="submit"
              >
                {isPending ? "Confirming..." : "Mint token"}
              </button>
              {hash && <div>Tx hash: {hash}</div>}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed.</div>}
            </form>
          </div>
        )}
        {/* {isNFTContractOwner && (
          <div className="pt-4">Set a new minter account</div>
        )} */}
      </div>
    </div>
  );
}
