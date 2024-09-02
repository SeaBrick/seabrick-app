"use client";
import React, { useEffect, useState } from "react";
import RequireWallet from "../components/utils/RequireWallet";
import { useRouter } from "next/navigation";
import { useAccountContext } from "@/context/accountContext";
import { useContractContext } from "@/context/contractContext";
import { useAccount } from "wagmi";
import ColoredSpinner from "../components/spinners/ColoredSpinner";
import PageLoaderSpinner from "../components/spinners/PageLoaderSpinner";

export default function AdminPage() {
  const router = useRouter();
  const { address: walletAddress } = useAccount();
  const { data: contractsData } = useContractContext();
  const { data: accountData } = useAccountContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("walletAddress: ", walletAddress);
    if (!walletAddress) {
      router.push("/");
    }

    // It has a wallet conntected, but it is not a NFT minter or owner contract
    if (
      !accountData.isMinter &&
      contractsData.market.owner !== walletAddress &&
      contractsData.seabrick.owner !== walletAddress
    ) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [accountData, contractsData, router, walletAddress]);

  return (
    <RequireWallet>
      {isLoading ? (
        <PageLoaderSpinner />
      ) : (
        <PageLoaderSpinner />

        // <div className="w-1/2 mx-auto">
        //   <h1>Admin Page</h1>
        //   <p>Welcome to the admin section.</p>
        // </div>
      )}
    </RequireWallet>
  );
}
