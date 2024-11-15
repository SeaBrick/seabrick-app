import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useConfig } from "wagmi";
import { useContractContext } from "@/context/contractContext";
import { ERC20Token } from "@/lib/interfaces";
import Modal from "./Modal";
import {
  approveTokens,
  toastifyPromiseWrapper,
} from "@/lib/contracts/clientTransactions";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { ReadContractErrorType } from "wagmi/actions";

interface ApproveERC20TokensProps {
  token: ERC20Token;
  totalAmount: bigint;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchAllowance: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<bigint, ReadContractErrorType>>;
}
const ApproveERC20Modal: React.FC<ApproveERC20TokensProps> = ({
  open,
  setOpen,
  token,
  totalAmount,
  refetchAllowance,
}) => {
  const [amountToApprove, setAmountToApprove] = useState<bigint>(0n);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const config = useConfig();
  const {
    data: {
      market: { id: marketAddress },
    },
  } = useContractContext();

  async function submitApprove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // User is on approving process
    setIsApproving(true);

    // Approve tokens tranasction with toastify.promise wrapper
    toastifyPromiseWrapper(() =>
      approveTokens(config, {
        tokenAddress: token.address,
        marketAddress,
        amount: amountToApprove,
      })
    );

    // Refetch the allowance of the market
    await refetchAllowance();

    // Closing the approve process
    setIsApproving(false);
    setOpen(false);
  }

  useEffect(() => {
    // Slip page of 1%
    // But we only will be approve the difference
    const amountWithSlip = (totalAmount * 1n) / 100n + totalAmount;
    setAmountToApprove(amountWithSlip);
  }, [totalAmount]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="rounded flex flex-col gap-y-4 bg-white px-6 py-8 w-[500px]">
        <h1 className="text-xl font-bold font-['Noto Sans']">Approve tokens</h1>

        <div>
          <p className="text-sm font-['Noto Sans']">
            You need to approve your tokens to continue
          </p>
          <p className="text-sm font-['Noto Sans']">
            We will approve only the difference
          </p>
        </div>
        <form
          onSubmit={submitApprove}
          className="rounded flex flex-col gap-y-2 "
        >
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
            disabled={isApproving}
            className="grow shrink basis-0 self-stretch bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 hover:bg-[#2069a0]/80 disabled:cursor-not-allowed disabled:bg-gray-400 text-center text-white text-sm font-normal font-['Noto Sans'] flex justify-center p-2 rounded w-fit mx-auto"
            type="submit"
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ApproveERC20Modal;
