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
import Image from "next/image";
import Link from "next/link";
import SubmitButton from "@/components/buttons/SubmitButton";
import { isEmpty } from "lodash";

// TODO: Add captchas
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

interface Errors {
  message?: string;
}

export default function LoginPage() {
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const { refetch: authRefetch } = useAuth();

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function loginFormAction(formData: FormData) {
    const newErrors: Errors = {};

    if (!email) {
      newErrors.message = "Email is required";
    } else if (!password) {
      newErrors.message = "Password is required";
    }

    // if errors is NOT empty, somethins is missing. We do not try to login
    // Maube use a tostify here?
    if (!isEmpty(newErrors)) {
      setErrors(newErrors);
      return;
    }

    const resp = await login(formData);

    if (resp && resp.error) {
      newErrors.message = resp.error;
      setErrors(newErrors);
      return;
    }

    // Refetch the user
    await authRefetch();
  }

  return (
    <>
      <div className="w-full h-[80vh] md:h-screen relative bg-[#f6f6f6] flex justify-center">
        <Image
          className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[50px] rounded-br-[50px]"
          src={`/login-bg.webp`}
          alt="banner"
          width={1920}
          height={414}
        />
        <form
          action={loginFormAction}
          className="h-[339px] md:h-[447px] w-[350px] md:w-[606px] mt-[40px] md:mt-[180px] p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10"
        >
          <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
            <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">
              Authentication
            </div>
            <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">
              Log In
            </div>
          </div>

          <div className="self-stretch h-[293px] flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="email"
                    className="text-[#333333] text-xs font-normal font-['Noto Sans']"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="self-stretch h-11 px-[15px] py-2.5 rounded-[5px] border border-[#333333] text-[#333333] text-sm font-normal font-['Noto Sans'] bg-[#efeff4]/60 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="password"
                    className="text-[#333333] text-xs font-normal font-['Noto Sans']"
                  >
                    Password
                  </label>
                  <div className="relative self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 flex items-center justify-between">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-transparent text-[#8a8a8f] text-sm font-normal font-['Noto Sans'] w-full outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-[#8a8a8f]" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-[#8a8a8f]" />
                      )}
                    </button>
                  </div>
                  <p className="text-red-500 text-xs">{errors.message}</p>
                </div>
              </div>
            </div>

            <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
              <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                <SubmitButton label="Log In" loadingLabel="Login..." />

                {haveWallet && (
                  <button
                    type="button"
                    className="grow shrink basis-0 h-[45px] p-[17px] bg-[#333333] rounded-[5px] justify-center items-center gap-2.5 flex disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <span className="text-right text-white text-sm font-normal font-['Noto Sans']">
                      Connect using your Wallet
                    </span>
                  </button>
                )}
              </div>

              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                  Do you want to create an account?
                </div>
                <Link
                  href="/register"
                  prefetch={true}
                  className="text-[#333333] text-xs font-bold font-['Noto Sans']"
                >
                  Register
                </Link>
              </div>
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                  Forgot your password?
                </div>

                <Link
                  href="/reset-password"
                  prefetch={true}
                  className="text-[#333333] text-xs font-bold font-['Noto Sans']"
                >
                  Reset Password
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
/* {!haveWallet && <LoginEmailForm />}

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
        )} */

const EmailForm: React.FC = () => {
  const { user } = useAuth();

  return <div>{user && <>Use Email!</>}</div>;
};

const WalletForm: React.FC = () => {
  const { user } = useAuth();

  return <div>{user && <>Use Wallet!</>}</div>;
};
