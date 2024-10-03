"use client";
import React, { useEffect, useState } from "react";
import ConnectButton from "../components/buttons/ConnectButton";
import { useAccount } from "wagmi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type LoginEmailFormProps = unknown;
function LoginEmailForm(_props: LoginEmailFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-y-4 items-center w-full max-w-xl">
      <p className="text-gray-700">Log into your account</p>
      <form className="flex flex-col gap-y-4 w-full" action={() => {}}>
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

export default function LoginPage() {
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);

  return (
    <div className="w-1/2 mx-auto">
      <h1>Login Page</h1>

      {!haveWallet && <p>Login directly with email</p>}
      {haveWallet && !isConnected && (
        <p>
          Ask to connect wallet. Show first login with wallet, give other option
          as email
        </p>
      )}

      {haveWallet && isConnected && (
        <p>Show first login with wallet, give other option as email</p>
      )}

      {/* <div>{haveWallet && !isConnected && <Connect />}</div>
      <div>{haveWallet && !isConnected && <ConnectButton />}</div> */}
      <div>{haveWallet && <ConnectButton />}</div>

      <div className="flex flex-col items-center">
        <LoginEmailForm />
      </div>
    </div>
  );
}
