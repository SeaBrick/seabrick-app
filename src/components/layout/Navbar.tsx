"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SeabrickSVG from "../utils/SeabrickSVG"
import { useAccount } from "wagmi"
import { useEffect } from "react"
import { getAccount } from "@/lib/subgraph"
import { Address, getAddress } from "viem"
import { useContractContext } from "@/context/contractContext"
import {
  accountInitialState,
  useAccountContext,
} from "@/context/accountContext"
import { useAuth } from "@/context/authContext"
import AccountDropdown from "../dropdowns/AccountDropdown"

export function Navbar() {
  const pathname = usePathname()
  const { address: walletAddress } = useAccount()
  const { data: contractsData } = useContractContext()
  const { data: accountData, dispatch: dispatchAccount } = useAccountContext()
  const { user } = useAuth()

  useEffect(() => {
    async function callGetter(address: Address) {
      const account = await getAccount(address)
      if (account) {
        dispatchAccount(account)
      }
    }

    // Check wallet address is defined to be call
    if (walletAddress) {
      callGetter(walletAddress)
    } else {
      // Or just put initial state otherwise
      dispatchAccount(accountInitialState)
    }
  }, [dispatchAccount, walletAddress])

  return (
    <header className="z-10 h-24 shadow mb-8 bg-white">
      <div className="flex h-full items-center justify-between w-3/5 mx-auto">
        <SeabrickSVG />

        <div className="ml-60 flex gap-x-10 hover:direct-children:text-seabrick-blue mr-5">
          <Link
            className={`${pathname === "/buy" && "text-seabrick-blue"}`}
            href="/buy"
          >
            Buy
          </Link>
          <Link href="/test">Test</Link>

          {/* FIXME: This NOT only depends on the wallet connect. Also depends on the user role */}
          {user &&
            walletAddress &&
            (accountData.isMinter ||
              getAddress(contractsData.market.owner) == walletAddress ||
              getAddress(contractsData.seabrick.owner) == walletAddress) && (
              <Link
                className={`${pathname === "/admin" && "text-seabrick-blue"}`}
                href="/admin"
              >
                Admin
              </Link>
            )}
        </div>

        {/* TODO: Better UX for account details */}
        {user ? (
          <AccountDropdown />
        ) : (
          <Link
            className={`${pathname === "/login" && "text-seabrick-blue"} hover:text-seabrick-blue`}
            href="/login"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  )
}
