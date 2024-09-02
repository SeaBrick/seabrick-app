import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Container from "../utils/Container";
import Modal from "./Modal";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { Hash } from "viem";
import { useAccount } from "wagmi";

interface SuccessClaimModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  txHash: Hash;
}
export default function SuccessClaimModal({
  open,
  setOpen,
  txHash,
}: SuccessClaimModalProps) {
  const { chain } = useAccount();
  const [txScanner, setTxScanner] = useState<string>("");

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
            <p>Tokens claimed</p>
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
