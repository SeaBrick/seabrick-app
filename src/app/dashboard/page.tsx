"use client"
import { UserTransactionHistoryData } from "@/components/cards/UserTransactionsHistory"
import Image from "next/image"
import { useAuth } from "@/context/authContext"
import DashboardComponent from "@/components/layout/DashboardComponent"
import { wrapPromise } from "@/lib/utils"
import { getLatestBuys, getLatestTransfers } from "@/lib/subgraph"
//
const getLatestBuysInfo = async () => {
  return await getLatestBuys()
}
const getLatestTransfersInfo = async () => {
  return await getLatestTransfers()
}
//
const buyData = wrapPromise(getLatestBuysInfo())
const transfersData = wrapPromise(getLatestTransfersInfo())
//

export default function Dashboard() {
  //
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
  ]

  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "owner"

  return (
    <>
      <div className="w-full px-3 max-w-[1500px] m-auto">
        <div className="w-full justify-start items-center gap-2 inline-flex mb-4">
          <Image
            src={`/brick.png`} // TODO: linkear la img
            alt="user-image"
            height={45}
            width={48}
            className="rounded-[100px]"
          />

          <div className="h-[70px] flex-col justify-center items-start gap-px inline-flex">
            <div className="self-stretch text-[#666666] text-[9px] font-normal font-['Noto Sans']">
              Welcome Back!
            </div>
            <div className="text-black text-2xl font-normal font-['Noto Sans']">
              {user?.user_metadata["name"] ||
                user?.user_metadata["fullname"] ||
                "User"}
            </div>
          </div>
        </div>
        <DashboardComponent
          userTransactionData={testDataMap}
          dataBuys={buyData.read()}
          dataTransfer={transfersData.read()}
          isAdmin={isAdmin}
        />
      </div>
    </>
  )
}
