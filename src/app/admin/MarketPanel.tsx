import { useAggregatorsContext } from "@/context/aggregatorsContext";
import { useContractContext } from "@/context/contractContext";
import { formatUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { iMarketAbi } from "../lib/contracts/abis";
import SuccessClaimModal from "../components/modals/SuccessClaimModal";
import { useEffect, useState } from "react";

export default function MarketPanel() {
  const [open, setOpen] = useState<boolean>(false);
  const {
    refetch: refetchAggregators,
    data: { tokens, aggregators },
  } = useAggregatorsContext();
  const {
    data: {
      market: { id: marketAddress, owner, price },
    },
  } = useContractContext();

  const { data: hash, writeContractAsync } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
    confirmations: 4,
  });

  async function submit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) {
    e.preventDefault();

    await writeContractAsync({
      address: marketAddress,
      abi: iMarketAbi,
      functionName: "claim",
      args: [aggregators[index].name],
    });
  }

  useEffect(() => {
    if (isConfirmed == true) {
      refetchAggregators(receipt.blockNumber);
    }
  }, [isConfirmed, receipt, refetchAggregators]);

  useEffect(() => {
    setOpen(true);
  }, [isConfirmed]);

  return (
    <div className="px-8 pt-6 pb-8 flex flex-col gap-y-4">
      <p className="text-2xl font-bold">Market panel</p>
      <div className="flex flex-col gap-y-4 bg-seabrick-blue rounded p-4 text-white divide-y-2 divide-white">
        <div>
          <p className="font-bold" title={marketAddress}>
            Contract: <span className="font-normal">{marketAddress}</span>
          </p>
          <p className="font-bold" title={owner}>
            Owner: <span className="font-normal">{owner}</span>
          </p>
          <p className="font-bold" title={owner}>
            Price: <span className="font-normal">{price} USD</span>
          </p>
        </div>
        {tokens.map((token, i) => (
          <div
            key={`${token.id}-${i}`}
            className="first:pt-0 flex items-center justify-between pt-4"
          >
            <div>
              <p className="font-bold">
                Token: <span className="font-normal">{token.symbol}</span>
              </p>
              <p className="font-bold">
                Collected:{" "}
                <span className="font-normal">
                  {formatUnits(
                    BigInt(token.totalCollected),
                    parseInt(token.decimals)
                  )}
                </span>
              </p>
            </div>
            <div>
              <button
                onClick={(e) => submit(e, i)}
                className="bg-seabrick-green p-2 rounded"
              >
                Claim
              </button>
            </div>
          </div>
        ))}
      </div>
      {hash && <div>Tx hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {isConfirmed && hash && (
        <SuccessClaimModal open={open} setOpen={setOpen} txHash={hash} />
      )}
    </div>
  );
}
