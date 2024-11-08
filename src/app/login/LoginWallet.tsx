"use client";
import { UserRejectedRequestError } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { createClient } from "@/lib/supabase/client";
import { loginWithWallet } from "@/app/login/actions";
import Modal from "@/components/modals/Modal";
import ConnectButton from "@/components/buttons/ConnectButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import Link from "next/link";

import type { Dispatch, SetStateAction } from "react";
import type { Errors } from "@/lib/interfaces";

interface LoginWallet {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginWallet: React.FC<LoginWallet> = ({ open, setOpen }: LoginWallet) => {
  const { address, isConnected } = useAccount();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const { signMessageAsync } = useSignMessage();
  const { refetch: authRefetch } = useAuth();

  function showError(value: string | Errors) {
    // If value is string, we create te object
    setErrors(typeof value == "string" ? { message: value } : value);
  }

  async function loginWalletFormAction(formData: FormData) {
    const address = formData.get("address")?.toString();
    if (!address) {
      showError("No address to log in");
      return;
    }

    const params = new URLSearchParams({ address });
    const response = await fetch(`/api/request_message?${params}`, {
      method: "GET",
    });

    if (!response.ok) {
      showError("Failed to generate message to sign");
      return;
    }

    // Since the response is ok, we safely get the message
    const messageGenerated = (await response.json()).message;

    try {
      // Ask the user to sign the message
      const messageSigned = await signMessageAsync({
        message: messageGenerated,
      });

      // Store signed message in formData
      formData.set("signature", messageSigned);
    } catch (error) {
      // If some error happened, we cancel the submission
      let errorMessage = "Unknown error found";

      if (error instanceof UserRejectedRequestError) {
        errorMessage = "User rejected the request";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.log(error);
      }

      showError(errorMessage);
      return;
    }

    // Send to the action
    const resp = await loginWithWallet(formData);

    if (resp && resp.error) {
      showError(resp.error);
      return;
    }

    // Refetch the user
    await authRefetch();
  }

  useEffect(() => {
    async function isAddressAccount() {
      const { error: userError } = await createClient()
        .from("wallet_users")
        .select("address")
        .eq("address", address?.toLowerCase())
        .single();

      if (userError) {
        if (userError.code != "PGRST116") {
          console.error(userError);
        }
        setIsRegistered(false);
        showError("Wallet not registered");
      }

      if (!userError) {
        setIsRegistered(true);
      }
    }

    if (isConnected && address) {
      isAddressAccount();
    } else {
      setIsRegistered(false);
    }
  }, [isConnected, address]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="h-80 w-96 md:w-[550px] p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10">
        <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
          <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">
            Wallet authentication
          </div>
          <div className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
            Log In
          </div>
        </div>

        <ConnectButton />

        <div className="w-full flex flex-col gap-y-3">
          <form action={loginWalletFormAction}>
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
          <p className="text-red-500 text-xs">{errors.message}</p>
          <div className="self-stretch justify-between items-center inline-flex w-3/4 mx-auto text-center">
            <Link
              href="/register?tab=wallet"
              prefetch={true}
              className="text-[#333333] text-sm font-bold font-['Noto Sans'] text-center mx-auto"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginWallet;
