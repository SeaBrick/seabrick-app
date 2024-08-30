"use client";
import React, { Suspense } from "react";
import { useAccount } from "wagmi";
import RequireWallet from "../components/utils/RequireWallet";
import BuyNFT from "./BuyNFT";

export default function BuyPage() {
  const { isConnected } = useAccount();

  return (
    <RequireWallet>
      <div className="w-1/2 mx-auto pt-8">
        <p className="text-3xl font-bold mb-8">Buy Seabrick NFT</p>
        <Suspense
          fallback={
            // This is the main spinner that will be show on load
            <div className="mx-auto w-60">Loading...</div>
          }
        >
          <BuyNFT />
        </Suspense>
      </div>
    </RequireWallet>
  );
}
