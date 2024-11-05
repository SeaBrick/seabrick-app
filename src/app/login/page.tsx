"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ConnectButton from "@/components/buttons/ConnectButton";
import Modal from "@/components/modals/Modal";
import Container from "@/components/utils/Container";
import { login, signinWithWallet, signUpWithWallet, signup } from "./actions";
import { useAuth } from "@/context/authContext";
import { createClient } from "@/lib/supabase/client";
import SigninWalletModal from "@/components/modals/SigninWalletModal";
import { useFormState } from "react-dom";

// TODO: Add captchas

type LoginEmailFormProps = unknown;
function LoginEmailForm(_props: LoginEmailFormProps) {
  const { refetch } = useAuth();

  const [open, setOpen] = useState<boolean>(false);

  function FormSignEmail({
    signUp = false,
    formAction,
  }: {
    signUp?: boolean;
    formAction: (formData: FormData) => void;
  }) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <form className="flex flex-col gap-y-4 w-full" action={formAction}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          className="bg-gray-300 py-2 px-4 rounded-md border border-seabrick-green text-gray-800"
        />

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-gray-300 py-2 px-4 rounded-md border border-seabrick-green text-gray-800 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2.5"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <button
          className="bg-seabrick-green p-2 rounded-md text-white"
          type="submit"
        >
          {signUp ? "Sign up " : "Log in"}
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 items-center w-full max-w-xl">
      <FormSignEmail
        formAction={(data) => {
          login(data).then(() => {
            refetch();
          });
        }}
      />

      <p>
        Do not have an account?{" "}
        <span
          className="text-seabrick-green hover:underline hover:cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Sign up
        </span>{" "}
        with your email
      </p>

      <Modal open={open} setOpen={setOpen}>
        <Container>
          <div className="border rounded py-8 px-10 flex flex-col items-center gap-y-4 w-[40rem]">
            <p className="text-gray-800">Create an account</p>

            <FormSignEmail
              signUp
              formAction={(data) => {
                signup(data).then(() => {
                  refetch();
                });
              }}
            />
          </div>
        </Container>
      </Modal>
    </div>
  );
}

function LoginWalletForm() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { refetch } = useAuth();

  const [needRegister, setNeedRegister] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formDataWallet, setFormDataWallet] = useState<FormData>();

  // TODO: Fix issue that init message state does not reset.
  // Need to use `useState` as I did on SigninWalletModal
  const initMessageState = { message: "" };
  const [messageState, formActionState] = useFormState(
    formActionSignIn,
    initMessageState
  );

  useEffect(() => {
    async function isAddressAccount() {
      const { error: userError } = await createClient()
        .from("wallet_users")
        .select("address")
        .eq("address", address)
        .single();

      if (userError && userError.code == "PGRST116") {
        setNeedRegister(true);
      }

      if (!userError) {
        setNeedRegister(false);
      }
    }

    if (isConnected) {
      isAddressAccount();
    }
  }, [isConnected, address]);

  async function formActionSignIn(
    currentState: { message: string },
    formData: FormData
  ) {
    try {
      const address = formData.get("address")?.toString();
      if (!address) {
        return { message: "No address passed or connected to log in" };
      }

      const params = new URLSearchParams({ address });
      const response = await fetch(`/api/request_message?${params}`, {
        method: "GET",
      });

      if (response.ok) {
        // If the response is OK, retrieve and sign the message
        const messageGenerated = (await response.json()).message;

        // Sign the message
        const resp = await signMessageAsync({ message: messageGenerated });

        // Store signed message in formData
        formData.set("signature", resp);

        if (needRegister) {
          setIsOpen(true);
          setFormDataWallet(formData);
        } else {
          await signinWithWallet(currentState, formData);
          await refetch();
        }

        return { message: "" };
      } else {
        // Cannot get the message from server to sign in
        return { message: "Error getting the message to sign" };
      }
    } catch (error) {
      console.error(error);
      return { message: "unknown error" };
    }
  }

  return (
    <>
      {isOpen && (
        <SigninWalletModal
          open={isOpen}
          setOpen={setIsOpen}
          formAction={signUpWithWallet}
          formData={formDataWallet}
        />
      )}
      <div className="flex flex-col gap-y-4 items-center w-full max-w-xl">
        <ConnectButton />

        {isConnected && (
          <form
            className="flex flex-col gap-y-4 w-full"
            action={formActionState}
          >
            <input
              id="address"
              name="address"
              type="text"
              hidden
              readOnly
              value={address}
              className="disabled:cursor-not-allowed"
            />
            <button
              className="bg-seabrick-green p-2 rounded-md text-white"
              type="submit"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default function LoginPage() {
  const [haveWallet, setHaveWallet] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);

  return (
    <div className="w-1/2 mx-auto space-y-10">
      <h1 className="text-gray-700 text-2xl w-fit mx-auto">
        Log into your account
      </h1>

      <div className="flex flex-col items-center w-full gap-y-4">
        {!haveWallet && <LoginEmailForm />}

        {haveWallet && (
          <div className="divide-y-2 space-y-6 max-w-xl w-full">
            <div className="flex flex-col gap-y-4 items-center">
              <p className="text-gray-800">Use your wallet to sign in</p>

              <LoginWalletForm />
            </div>
            <div className="pt-4 flex flex-col gap-y-4 items-center">
              <p className="text-gray-800">Or use your email</p>

              <LoginEmailForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
