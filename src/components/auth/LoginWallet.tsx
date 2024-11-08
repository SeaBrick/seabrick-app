"use client";
import { useAuth } from "@/context/authContext";
import { useAccount, useSignMessage } from "wagmi";
import Modal from "../modals/Modal";
import type { Dispatch, SetStateAction } from "react";

// should be using modal
// should open the modal and ask to connect wallet if not connected
// should check if the address connected is registered or not
//     - if registered, can login with wallet
//     - if not registered, should not let the user login. Should show a button
//          to redirect to register page
// when click login, should ask to sign a message
//     - if the user not sign the message, we show a error message on that
//     - if the user sign, should made the request automatically
// if the response is ok, this redirect to home page
// if the response is negative, show message (most likely not happening but we don't know )
interface LoginWallet {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginWallet: React.FC<LoginWallet> = ({ open, setOpen }: LoginWallet) => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { refetch } = useAuth();

  return (
    <Modal open={open} setOpen={setOpen}>
      <p className="p-4 bg-white"> LETTS GOU</p>
    </Modal>
  );
};

export default LoginWallet;
