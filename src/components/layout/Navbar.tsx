"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SeabrickSVG from "../utils/SeabrickSVG";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { getAccount } from "@/lib/subgraph";
import { Address, getAddress } from "viem";
import { useContractContext } from "@/context/contractContext";
import {
  accountInitialState,
  useAccountContext,
} from "@/context/accountContext";
import { useAuth } from "@/context/authContext";
import AccountDropdown from "../dropdowns/AccountDropdown";

export function Navbar() {
  const pathname = usePathname();
  const { address: walletAddress } = useAccount();
  const { data: contractsData } = useContractContext();
  const { data: accountData, dispatch: dispatchAccount } = useAccountContext();
  const { user } = useAuth();

  useEffect(() => {
    async function callGetter(address: Address) {
      const account = await getAccount(address);
      if (account) {
        dispatchAccount(account);
      }
    }

    // Check wallet address is defined to be call
    if (walletAddress) {
      callGetter(walletAddress);
    } else {
      // Or just put initial state otherwise
      dispatchAccount(accountInitialState);
    }
  }, [dispatchAccount, walletAddress]);

  return (
    <header className="z-10 h-[70px] py-0 px-[30px] mb-1 flex justify-between items-center shrink-0 bg-white shadow-2md">
      <div className="flex h-[70px] items-center justify-between w-full mx-auto shrink-0">
        <div className="flex h-[70px] items-center justify-between w-6/12 mx-auto shrink-0">
          <SeabrickSVG />
        </div>

        <div className="flex h-[70px] w-6/12 justify-end items-center gap-8 hover:direct-children:text-seabrick-blue ">
          <Link
            className={`${pathname === "/buy" && "text-text-gray"}`}
            href="/buy"
          >
            Register
          </Link>

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

          {/* TODO: Better UX for account details */}
          {user ? (
            <AccountDropdown />
          ) : (
            <Link
            className={`${pathname === "/login" && "text-text-gray"} hover:text-seabrick-blue`}
            href="/login"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
