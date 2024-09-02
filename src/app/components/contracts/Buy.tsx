import { iMarketAbi } from "@/app/lib/contracts/abis";
import { Aggregator } from "@/app/lib/interfaces";
import { useContractContext } from "@/context/contractContext";
import { getAddress } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import SuccessBuyModal from "../modals/SuccessBuyModal";
import { useEffect, useState } from "react";
import { RefetchOptions } from "@tanstack/react-query";
import { useAggregatorsContext } from "@/context/aggregatorsContext";

interface BuyProps {
  aggregator: Aggregator;
  refetch: (options?: RefetchOptions) => Promise<unknown>;
}
export default function Buy({ aggregator, refetch }: BuyProps) {
  const {
    data: {
      market: { id: marketAddress },
    },
  } = useContractContext();

  const { refetch: refetchAggregators } = useAggregatorsContext();

  const { data: hash, writeContract, isPending } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
    confirmations: 4,
  });

  const { address: walletAddress } = useAccount();
  const [open, setOpen] = useState<boolean>(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const buyer = getAddress(formData.get("buyer") as string);

    writeContract({
      address: marketAddress,
      abi: iMarketAbi,
      functionName: "buy",
      args: [buyer, aggregator.name],
    });
  }

  useEffect(() => {
    if (isConfirmed == true) {
      refetch();
      refetchAggregators(receipt.blockNumber);
    }
  }, [isConfirmed, receipt, refetch, refetchAggregators]);

  return (
    <div className="rounded py-4 flex flex-col gap-y-4">
      <h1 className="text-xl">Buy NFT</h1>
      <form
        onSubmit={submit}
        className="rounded flex flex-col gap-y-2 direct-children:p-2 direct-children:rounded"
      >
        <input
          name="buyer"
          placeholder="Buyer of the NFT (owner of the funds)"
          required
          hidden
          defaultValue={walletAddress}
        />
        <button
          disabled={isPending || isConfirming || isConfirmed}
          className="bg-seabrick-green p-2 text-white disabled:bg-slate-400"
          type="submit"
        >
          {isPending ? "Confirming..." : "Buy NFT"}
        </button>
        {hash && <div>Tx hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}

        {isConfirmed && hash && (
          <SuccessBuyModal
            open={open}
            setOpen={setOpen}
            txHash={hash}
            receipt={receipt}
          />
        )}
      </form>
    </div>
  );
}
