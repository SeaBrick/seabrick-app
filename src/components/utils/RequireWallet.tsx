"use client";
import React from "react";
import { useAccount } from "wagmi";

interface RequireWalletProps {
  children: React.ReactNode;
}
export default function RequireWallet({ children }: RequireWalletProps) {
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <>{children}</>
      ) : (
        <div className="mb-8 mt-14 text-2xl text-gray-800 w-1/2 mx-auto">
          Please, connect your wallet
        </div>
      )}
    </>
  );
}
