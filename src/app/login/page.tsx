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
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import SubmitButton from "@/components/buttons/SubmitButton";

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

interface Errors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);
  
  
  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { email, password });
      // Aquí puedes enviar el formulario o hacer una llamada a la API
    }
  };


  return (
  <>
      <div className="w-full h-[80vh] md:h-screen relative bg-[#f6f6f6] flex justify-center">
        <Image className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[50px] rounded-br-[50px]" src={`/login-bg.png`} alt="banner" width={1920} height={414}/>                
        <form onSubmit={handleSubmit} className="h-[339px] md:h-[447px] w-[350px] md:w-[606px] mt-[40px] md:mt-[180px] p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10">
          <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
            <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Register</div>
              <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Log In</div>
          </div>
          
            <div className="self-stretch h-[293px] flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">                        
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="email" className="text-[#333333] text-xs font-normal font-['Noto Sans']">
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
                      defaultValue=""
                    />                  
                  </div>
                </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="password" className="text-[#333333] text-xs font-normal font-['Noto Sans']">
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
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>       
              </div>
            </div>
          
            <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
              <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                <button className="grow shrink basis-0 self-stretch p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
                  <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Log In</span>
                </button>                
                <button className="grow shrink basis-0 h-[45px] p-[17px] bg-[#333333] rounded-[5px] justify-center items-center gap-2.5 flex">
                  <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Connect using your Wallet</span>
                </button>
              </div>
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">Do you want to create an account?</div>
                <button className="text-[#333333] text-xs font-bold font-['Noto Sans']">Register</button>
              </div>
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">Forgot your password?</div>
                  <button className="text-[#333333] text-xs font-bold font-['Noto Sans']">Reset Password</button>
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
}

const WalletForm: React.FC = () => {
  const { user } = useAuth();

  return <div>{user && <>Use Wallet!</>}</div>;
};
