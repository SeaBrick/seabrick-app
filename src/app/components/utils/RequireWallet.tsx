"use client";
import React from "react";
import { useAccount } from "wagmi";

export default function RequireWallet({ children }: any) {
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
