"use client";
import React, { Suspense } from "react";
import RequireWallet from "@/app/components/utils/RequireWallet";
import BuyNFT from "./BuyNFT";

export default function BuyPage() {
  return (
    <RequireWallet>
      <div className="w-1/2 mx-auto">
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
