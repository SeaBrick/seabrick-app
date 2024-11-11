"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccountContext } from "@/context/accountContext"
import { useContractContext } from "@/context/contractContext"
import { useAccount } from "wagmi"
import PageLoaderSpinner from "@/components/spinners/PageLoaderSpinner"
import { getAddress } from "viem"
import DashboardComponent from "@/components/layout/DashboardComponent"
import { getLatestBuys, getLatestTransfers } from "@/lib/subgraph"
import { wrapPromise } from "@/lib/utils"
import { useAuth } from "@/context/authContext"
import { UserTransactionHistoryData } from "@/components/cards/UserTransactionsHistory"

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

export default function AdminPage() {
  const router = useRouter()
  const { address: walletAddress } = useAccount()
  const { data: contractsData } = useContractContext()
  const { data: accountData } = useAccountContext()
  const { user } = useAuth()
  //
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isMinter, setIsMinter] = useState<boolean>(false) // conditional button
  const [isNFTContractOwner, setIsNFTContractOwner] = useState<boolean>(false)
  // conditional button
  const [isMarketOwner, setIsMarketOwner] = useState<boolean>(false)
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
  //
  useEffect(() => {
    if (!walletAddress) {
      // router.push("/dashboard")
    }

    // It has a wallet conntected, but it is not a NFT minter or owner contract
    if (
      // eslint-disable-next-line no-constant-condition
      !accountData.isMinter &&
      getAddress(contractsData.market.owner) !== walletAddress &&
      getAddress(contractsData.seabrick.owner) !== walletAddress
    ) {
      router.push("/dashboard")
    } else {
      // Individually checking each scenario

      // Is a token minter?
      if (accountData.isMinter) {
        setIsMinter(true)
      }

      // Is the market owner?
      if (getAddress(contractsData.market.owner) === walletAddress) {
        setIsMarketOwner(true)
      }

      // Is the NFT contract owner?
      if (getAddress(contractsData.seabrick.owner) === walletAddress) {
        setIsNFTContractOwner(true)
      }

      setIsLoading(false)
    }
  }, [accountData, contractsData, router, walletAddress])

  return (
    <>
      <div className="w-full px-3">
        {isLoading ? (
          <div className="py-24 my-auto">
            <PageLoaderSpinner height="h-max" width="w-1/2" />
          </div>
        ) : (
          <>
            <div className="w-full justify-start items-center gap-2 inline-flex mb-4">
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
              isAdmin={true} // by default
            />
          </>
        )}
      </div>
    </>
  )
}
