"use client";
import React, { Suspense } from "react";
import RequireWallet from "@/app/components/utils/RequireWallet";
import BuyNFT from "./BuyNFT";
import PageLoaderSpinner from "../components/spinners/PageLoaderSpinner";

export default function BuyPage() {
  return (
    <RequireWallet>
      <div className="w-1/2 mx-auto">
        <p className="text-3xl font-bold mb-8">Buy Seabrick NFT</p>
        <Suspense
          fallback={
            <div className="py-24 my-auto">
              <PageLoaderSpinner height="h-max" width="w-1/2" />
            </div>
          }
        >
          <BuyNFT />
        </Suspense>
      </div>
    </RequireWallet>
  );
}
