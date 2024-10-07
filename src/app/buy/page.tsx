"use client";
import React, { Suspense } from "react";
// import RequireWallet from "@/app/components/utils/RequireWallet";
import BuyNFT from "./BuyNFT";
import PageLoaderSpinner from "../components/spinners/PageLoaderSpinner";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function BuyPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    // TODO: Add little modal with message that need to login
    router.push("/login");
    return;
  }

  return (
    <div className="w-1/2 mx-auto">
      <p className="text-3xl font-bold mb-8">Buy Seabrick NFT</p>

      {user.user_metadata.type == "email" && <p>Buy with stripe</p>}

      {user.user_metadata.type == "wallet" && (
        <Suspense
          fallback={
            <div className="py-24 my-auto">
              <PageLoaderSpinner height="h-max" width="w-1/2" />
            </div>
          }
        >
          <BuyNFT />
        </Suspense>
      )}
    </div>
  );
}
