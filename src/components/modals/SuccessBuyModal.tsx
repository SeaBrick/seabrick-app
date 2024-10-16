import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Container from "../utils/Container";
import Modal from "./Modal";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { Hash, parseEventLogs, TransactionReceipt } from "viem";
import { getSingleBuy } from "@/lib/subgraph";
import { useAccount } from "wagmi";
import { iMarketAbi } from "@/lib/contracts/abis";

interface SuccessBuyModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  txHash: Hash;
  receipt: TransactionReceipt;
}
export default function SuccessBuyModal({
  open,
  setOpen,
  txHash,
  receipt,
}: SuccessBuyModalProps) {
  const { chain } = useAccount();
  const [tokenId, setTokenId] = useState<string>("");
  const [txScanner, setTxScanner] = useState<string>("");

  useEffect(() => {
    async function getBuy() {
      const logsBuy = parseEventLogs({
        abi: iMarketAbi,
        eventName: "Buy",
        logs: receipt.logs,
      });

      if (logsBuy.length > 0) {
        const log = logsBuy[0];
        setTokenId(log.args.id.toString());
      } else {
        // Try to use the sg
        const buyItem = await getSingleBuy(txHash);
        if (buyItem) {
          setTokenId(buyItem.tokenId);
        }
      }
    }
    getBuy();
  }, [receipt, txHash]);

  useEffect(() => {
    const explorerUrl = chain?.blockExplorers?.default.url;
    if (explorerUrl) {
      setTxScanner(new URL(`/tx/${txHash}`, explorerUrl).toString());
    }
  }, [chain, txHash]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <Container>
        <div className="border rounded py-8 px-10 flex flex-col items-center gap-y-4 w-[40rem]">
          <div className="flex flex-col items-center gap-y-2">
            <CheckCircleIcon className="size-12 text-green-600" />

            <p className="w-fit">Success</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <p>Seabrick NFT purchased - Token ID: #{tokenId.toString()}</p>
            <Link href={txScanner} target="_blank" rel="noopener noreferrer">
              <p className="bg-seabrick-blue text-white rounded p-2">
                View on block scanner
              </p>
            </Link>
          </div>
        </div>
      </Container>
    </Modal>
  );
}
