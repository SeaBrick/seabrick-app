"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SeabrickSVG from "../utils/SeabrickSVG";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { getAccount } from "@/app/lib/subgraph";
import { Address, getAddress } from "viem";
import { useContractContext } from "@/context/contractContext";
import {
  accountInitialState,
  useAccountContext,
} from "@/context/accountContext";
import { useAuth } from "@/context/authContext";
import { createClient } from "@/app/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const { address: walletAddress } = useAccount();
  const { data: contractsData } = useContractContext();
  const { data: accountData, dispatch: dispatchAccount } = useAccountContext();
  const { user } = useAuth();
  const supabaseClient = createClient();
  const router = useRouter();

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
    <header className="z-10 h-24 shadow mb-8">
      <div className="flex h-full items-center justify-between w-3/5 mx-auto">
        <SeabrickSVG />

        <div className="ml-60 flex gap-x-10 hover:direct-children:text-seabrick-blue mr-5">
          <Link
            className={`${pathname === "/buy" && "text-seabrick-blue"}`}
            href="/buy"
          >
            Buy
          </Link>
          <Link
            className={`${pathname === "/private" && "text-seabrick-blue"}`}
            href="/private"
          >
            Private
          </Link>

          {walletAddress &&
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
          <button
            onClick={async () => {
              const { error } = await supabaseClient.auth.signOut();
              if (error) {
                console.log(error);
              }

              router.push("/login");
            }}
          >
            User: {user.email}
          </button>
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
  );
}
