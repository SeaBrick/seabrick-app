"use client";
import React, { useEffect, useState } from "react";
import ConnectButton from "../components/buttons/ConnectButton";
import { useAccount, useSignMessage } from "wagmi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function ConnectButton2() {
  return <w3m-connect-button />;
}

type LoginEmailFormProps = unknown;
function LoginEmailForm(_props: LoginEmailFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formActionSignIn = async (formData: FormData) => {
    console.log("log in with email");
  };

  return (
    <div className="flex flex-col gap-y-4 items-center w-full max-w-xl">
      <form className="flex flex-col gap-y-4 w-full" action={formActionSignIn}>
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
          Log in
        </button>
      </form>

      <p>
        Do not have an account?{" "}
        <Link
          className="text-seabrick-green hover:underline"
          href={"/signup"}
          prefetch={true}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

function LoginWalletForm() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  async function formActionSignIn(formData: FormData): Promise<void> {
    try {
      const address = formData.get("address")?.toString();
      if (!address) {
        throw new Error("No address passed or connected to log in");
      }
      console.log("addre: ", address);

      const params = new URLSearchParams({ address });
      const response = await fetch(`/api/request_message?${params}`, {
        method: "GET",
      });

      console.log("a: ", `/api/request_message?${params}`);
      console.log(response);

      if (response.ok) {
        // If the response is OK, retrieve and sign the message
        const messageGenerateda = await response.json();
        console.log("messageGenerateda: ", messageGenerateda);
        const messageGenerated = messageGenerateda.message;

        // Sign the message
        const resp = await signMessageAsync({ message: messageGenerated });

        // Store signed message in formData
        formData.set("message", resp);

        // Send the formData to the login endpoint
        const formResp = await fetch("/api/login", {
          method: "POST",
          body: formData,
        });

        console.log("formREsp: ", formResp);

        const a = await formResp.json();
        console.log("averL ", a);
      } else {
        // Cannot get the message from server to sign in
        throw new Error("Error getting the message to sign");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-y-4 items-center w-full max-w-xl">
      <div>{<ConnectButton />}</div>

      {isConnected && (
        <form
          className="flex flex-col gap-y-4 w-full"
          action={formActionSignIn}
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
  );
}

export default function LoginPage() {
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [withEmail, setWithEmail] = useState<boolean>(false);

  useEffect(() => {
    console.log("xd");
    if (window.ethereum) {
      setHaveWallet(true);
    } else {
      setWithEmail(true);
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
