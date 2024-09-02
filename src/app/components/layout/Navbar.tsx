"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectButton from "../buttons/ConnectButton";
import SeabrickSVG from "../utils/SeabrickSVG";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { getAccount } from "@/app/lib/subgraph";
import { Address } from "viem";
import { useContractContext } from "@/context/contractContext";
import {
  accountInitialState,
  useAccountContext,
} from "@/context/accountContext";

export function Navbar() {
  const pathname = usePathname();
  const { address: walletAddress } = useAccount();
  const { data: contractsData } = useContractContext();
  const { data: accountData, dispatch: dispatchAccount } = useAccountContext();

  useEffect(() => {
    async function callGetter(address: Address) {
      const account = await getAccount(address);
      dispatchAccount(account);
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
            className={`${pathname === "/" && "text-seabrick-blue"}`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`${pathname === "buy" && "text-seabrick-blue"}`}
            href="/buy"
          >
            Buy
          </Link>

          {walletAddress &&
            (accountData.isMinter ||
              contractsData.market.owner == walletAddress ||
              contractsData.seabrick.owner == walletAddress) && (
              <Link
                className={`${pathname === "admin" && "text-seabrick-blue"}`}
                href="/admin"
              >
                Admin
              </Link>
            )}
        </div>

        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
