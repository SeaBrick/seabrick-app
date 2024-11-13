"use client";
import React, { Suspense, useEffect } from "react";
// import RequireWallet from "@/app/components/utils/RequireWallet";
import BuyNFT from "./BuyNFT";
import PageLoaderSpinner from "@/components/spinners/PageLoaderSpinner";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import BuyWithStripe from "./BuyWithStripe";

export default function BuyPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // router.push("/login");
      return;
    }
  }, [router, user]);

  return (
    <div className="w-1/2 mx-auto">
      <p className="text-3xl font-bold mb-8">Buy Seabrick NFT</p>

      {user && (
        <>
          {user.user_metadata.type == "email" && <BuyWithStripe />}

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
        </>
      )}
    </div>
  );
}
