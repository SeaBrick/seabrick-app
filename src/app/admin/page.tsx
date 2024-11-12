"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountContext } from "@/context/accountContext";
import { useContractContext } from "@/context/contractContext";
import { useAccount } from "wagmi";
import PageLoaderSpinner from "@/components/spinners/PageLoaderSpinner";
import { getAddress } from "viem";
import DashboardComponent from "@/components/layout/DashboardComponent";
import { getLatestBuys, getLatestTransfers } from "@/lib/subgraph";
import { wrapPromise } from "@/lib/utils";
import { useAuth } from "@/context/authContext";
import { UserTransactionHistoryData } from "@/components/cards/UserTransactionsHistory";

const getLatestBuysInfo = async () => {
  return await getLatestBuys();
};
const getLatestTransfersInfo = async () => {
  return await getLatestTransfers();
};
const buyData = wrapPromise(getLatestBuysInfo());
const transfersData = wrapPromise(getLatestTransfersInfo());

export default function AdminPage() {
  const { user, userRole } = useAuth();
  const [isMinter, setIsMinter] = useState<boolean>(false); // conditional button
  const [isNFTContractOwner, setIsNFTContractOwner] = useState<boolean>(false);
  // conditional button

  const testDataMap: UserTransactionHistoryData[] = [
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "claimed",
      token: "SOL",
      amount: 4,
    },
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "claimed",
      token: "SOL",
      amount: 3,
    },
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "minted",
      amount: 417,
    },
    {
      total: 400,
      hash: "0x00000000000000000000000000000000000000000",
      type: "minted",
      amount: 208,
    },
  ];

  return (
    <div className="w-full px-3 max-w-[1500px] m-auto">
      <div className="w-full justify-start items-center gap-2 inline-flex mb-4">
        <div className="h-[70px] flex-col justify-center items-start gap-px inline-flex">
          <div className="self-stretch text-[#666666] text-[9px] font-normal font-['Noto Sans']">
            Welcome Back!
          </div>
          <div className="text-black text-2xl font-normal font-['Noto Sans']">
            {user?.user_metadata["name"] || user?.email}
          </div>
        </div>
      </div>
      <DashboardComponent
        userTransactionData={testDataMap}
        dataBuys={buyData.read()}
        dataTransfer={transfersData.read()}
        isAdmin={userRole == "admin" || userRole == "owner"} // by default
        isMinter={isMinter}
        isNFTContractOwner={isNFTContractOwner}
      />
    </div>
  );
}
