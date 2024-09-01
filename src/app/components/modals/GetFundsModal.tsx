import { Dispatch, SetStateAction } from "react";
import Container from "../utils/Container";
import Modal from "./Modal";
import { Token } from "@/app/lib/interfaces";
// import IERC20 from "@/app/lib/contracts/abis/IERC20.json";
import { useAccount, useWriteContract } from "wagmi";
import { getAddress, parseUnits } from "viem";
import { addressResumer } from "@/app/lib/utils";
import { ierc20Abi } from "@/app/lib/contracts/abis";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: Token;
}
export default function GetFundsModal({ open, setOpen, token }: ModalProps) {
  const { address: walletAddress } = useAccount();
  const { address: tokenAddress, decimals } = token;

  const { data: hash, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = formData.get("amount") as string;
    const toAddress = formData.get("toAddress") as string;

    writeContract({
      address: tokenAddress,
      abi: ierc20Abi,
      functionName: "mint",
      args: [getAddress(toAddress), parseUnits(amount, parseInt(decimals))],
    });
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <Container>
        {walletAddress && (
          <div className="border rounded py-8 px-10 flex flex-col gap-y-4 w-[40rem]">
            <p className="text-xl font-semibold">
              Obtain {token.symbol} tokens
            </p>

            <p>Wallet Address: {addressResumer(walletAddress, 3)}</p>

            <form
              onSubmit={submit}
              className="rounded flex flex-col gap-y-2 direct-children:p-2 direct-children:rounded"
            >
              <input
                className="bg-gray-300"
                name="amount"
                type="number"
                min="0"
                step="1"
                placeholder="Amount"
                defaultValue={200}
                required
              />
              <input
                title="Your connected wallet address"
                disabled
                className="bg-gray-300 text-gray-500 cursor-not-allowed"
                name="to"
                placeholder="Address destinatary"
                required
                value={walletAddress}
              />
              <input type="hidden" name="toAddress" value={walletAddress} />
              <button className="bg-green-400 p-2 mt-4" type="submit">
                Get tokens
              </button>

              {hash && <div>Transaction Hash: {hash}</div>}
            </form>
          </div>
        )}
      </Container>
    </Modal>
  );
}
