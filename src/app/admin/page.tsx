"use client"
import React, { useEffect, useState } from "react"
import RequireWallet from "@/components/utils/RequireWallet"
import { useRouter } from "next/navigation"
import { useAccountContext } from "@/context/accountContext"
import { useContractContext } from "@/context/contractContext"
import { useAccount } from "wagmi"
import PageLoaderSpinner from "@/components/spinners/PageLoaderSpinner"
import Container from "@/components/utils/Container"
import { getAddress } from "viem"
import MarketPanel from "./MarketPanel"
import TokenPanel from "./TokenPanel"

export default function AdminPage() {
  const router = useRouter()
  const { address: walletAddress } = useAccount()
  const { data: contractsData } = useContractContext()
  const { data: accountData } = useAccountContext()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [isMinter, setIsMinter] = useState<boolean>(false)
  const [isNFTContractOwner, setIsNFTContractOwner] = useState<boolean>(false)
  const [isMarketOwner, setIsMarketOwner] = useState<boolean>(false)

  useEffect(() => {
    if (!walletAddress) {
      router.push("/dashboard")
    }

    // It has a wallet conntected, but it is not a NFT minter or owner contract
    if (
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
      <RequireWallet>
        <div className="w-1/2 mx-auto">
          {isLoading ? (
            <div className="py-24 my-auto">
              <PageLoaderSpinner height="h-max" width="w-1/2" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold mb-8">Admin Page</p>

              <div className="flex flex-col gap-y-8">
                {isMarketOwner && (
                  <Container>
                    <MarketPanel />
                  </Container>
                )}

                {(isMinter || isNFTContractOwner) && (
                  <Container>
                    <TokenPanel
                      isNFTContractOwner={isNFTContractOwner}
                      isMinter={isMinter}
                    />
                  </Container>
                )}
              </div>
            </>
          )}
        </div>
      </RequireWallet>
    </>
  )
}
