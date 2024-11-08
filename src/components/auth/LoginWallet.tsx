"use client";
import { useAuth } from "@/context/authContext";
import { useAccount, useSignMessage } from "wagmi";
import Modal from "../modals/Modal";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import ConnectButton from "../buttons/ConnectButton";
import SubmitButton from "../buttons/SubmitButton";
import { createClient } from "@/lib/supabase/client";

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
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const { signMessageAsync } = useSignMessage();
  const { refetch } = useAuth();

  useEffect(() => {
    async function isAddressAccount() {
      const { error: userError } = await createClient()
        .from("wallet_users")
        .select("address")
        .eq("address", address?.toLowerCase())
        .single();

      console.log(userError);

      if (userError) {
        if (userError.code != "PGRST116") {
          console.error(userError);
        }
        setIsRegistered(false);
      }

      if (!userError) {
        setIsRegistered(true);
      }
    }

    if (isConnected && address) {
      isAddressAccount();
    }

    if (!isConnected) {
      setIsRegistered(false);
    }
  }, [isConnected, address]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="h-[339px] md:h-[447px] w-[370px] md:w-[636px] mt-[40px] md:mt-[180px] p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10">
        <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
          <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">
            Wallet authentication
          </div>
          <div className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
            Log In
          </div>
        </div>

        <ConnectButton />

        <form
          className="w-full h-full"
          action={async () => {
            const delay = (ms: number) =>
              new Promise((res) => setTimeout(res, ms));

            await delay(5000);
          }}
        >
          <input
            id="address"
            name="address"
            type="text"
            hidden
            readOnly
            value={address ?? ""}
            className="disabled:cursor-not-allowed"
          />

          <SubmitButton
            label="Sign"
            loadingLabel="Login..."
            disable={!isRegistered}
            disabledTitle="Wallet not connected"
            buttonClass="w-1/2 h-[45px]"
          />
        </form>
      </div>
    </Modal>
  );
};

export default LoginWallet;
