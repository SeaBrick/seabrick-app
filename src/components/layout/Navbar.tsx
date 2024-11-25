"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SeabrickSVG from "../images/SeabrickSVG";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { getAccount } from "@/lib/subgraph";
import { Address } from "viem";
import {
  accountInitialState,
  useAccountContext,
} from "@/context/accountContext";
import { useAuth } from "@/context/authContext";
import AccountDropdown from "../dropdowns/AccountDropdown";

export function Navbar() {
  const pathname = usePathname();
  const { address: walletAddress } = useAccount();
  const { dispatch: dispatchAccount } = useAccountContext();
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
    <header className="z-10 w-full h-[70px] py-0 px-[30px] mb-1 flex justify-between items-center shrink-0 bg-white shadow-2md">
      <div className="flex h-[70px] max-w-[1920px] items-center justify-between w-full mx-auto shrink-0">
        <div className="flex h-[70px] items-center justify-between w-6/12 mx-auto shrink-0">
          <SeabrickSVG />
        </div>

        <div className="flex h-[70px] w-6/12 justify-end items-center gap-2.5 hover:direct-children:text-seabrick-blue ">
          {user ? (
            <AccountDropdown />
          ) : (
            <>
              <Link
                className={`${pathname === "/register" && "text-dark-gray"}`}
                href="/register"
              >
                Register
              </Link>
              <Link
                className={`${pathname === "/login" && "text-dark-gray"} hover:text-seabrick-blue`}
                href="/login"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
