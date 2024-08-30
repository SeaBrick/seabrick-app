"use client";
import React from "react";
import { useAccount } from "wagmi";
import RequireWallet from "../components/utils/RequireWallet";

export default function BuyPage() {
  const { isConnected } = useAccount();

  return (
    <RequireWallet>
      <div className="w-1/2 mx-auto">
        <h1>Buy Page</h1>
        <p>Welcome to the buy section.</p>
      </div>
    </RequireWallet>
  );
}
