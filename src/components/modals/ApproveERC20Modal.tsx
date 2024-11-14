import { useContractContext } from "@/context/contractContext";
import { ERC20Token } from "@/lib/interfaces";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Modal from "./Modal";
import { formatUnits } from "viem";
import { ierc20Abi } from "@/lib/contracts/abis";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ApproveERC20TokensProps {
  token: ERC20Token;
  totalAmount: bigint;
  currentMarketAllowance: bigint;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ApproveERC20Modal: React.FC<ApproveERC20TokensProps> = ({
  open,
  setOpen,
  token,
  totalAmount,
  currentMarketAllowance,
}) => {
  const [amountToApprove, setAmountToApprove] = useState<bigint>(0n);
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const {
    data: {
      market: { id: marketAddress },
    },
  } = useContractContext();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    writeContract({
      address: token.address,
      abi: ierc20Abi,
      functionName: "approve",
      args: [marketAddress, amountToApprove],
    });
  }

  useEffect(() => {
    // Slip page of 1%
    const amountWithSlip = (totalAmount * 1n) / 100n + totalAmount;
    if (currentMarketAllowance >= amountWithSlip) {
      setAmountToApprove(0n);
    } else {
      setAmountToApprove(amountWithSlip - currentMarketAllowance);
    }
  }, [currentMarketAllowance, totalAmount]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Tokens approved");
      setOpen(false);
    }
  }, [isConfirmed, setOpen]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="rounded flex flex-col gap-y-4 bg-white px-6 py-8 w-[500px]">
        <h1 className="text-xl font-bold font-['Noto Sans']">Approve tokens</h1>

        <p className="text-sm font-['Noto Sans']">
          You need to approve your tokens to continue
        </p>
        <form onSubmit={submit} className="rounded flex flex-col gap-y-2 ">
          <div className="space-y-2">
            <input
              title="Amount to approve"
              className="bg-gray-300 p-2 rounded cursor-default"
              name="amount"
              placeholder="Amount to approve"
              required
              readOnly
              type="text"
              value={formatUnits(amountToApprove, parseInt(token.decimals))}
            />
            <p className="text-yellow-500 text-sm font-['Noto Sans']">
              We will approve with 1% slip page
            </p>
          </div>
          <button
            disabled={isPending || isConfirming}
            className="grow shrink basis-0 self-stretch bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 hover:bg-[#2069a0]/80 disabled:cursor-not-allowed disabled:bg-gray-400 text-center text-white text-sm font-normal font-['Noto Sans'] flex justify-center p-2 rounded w-fit mx-auto"
            type="submit"
          >
            {isPending
              ? "Sending..."
              : isConfirming
                ? "Confirming..."
                : "Approve"}
          </button>

          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
        </form>
      </div>
    </Modal>
  );
};

export default ApproveERC20Modal;
