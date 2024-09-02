"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectButton from "../buttons/ConnectButton";
import SeabrickSVG from "../utils/SeabrickSVG";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { getAccount } from "@/app/lib/subgraph";
import { Address } from "viem";
import { Account } from "@/app/lib/interfaces";
import { useContractContext } from "@/context/contractContext";

export function Navbar() {
  const pathname = usePathname();
  const { address: walletAddress } = useAccount();
  const [accountData, setAccountData] = useState<Account>();
  const { data: contractsData } = useContractContext();

  useEffect(() => {
    async function callGetter(address: Address) {
      const account = await getAccount(address);
      setAccountData(account);
    }

    // Check wallet address
    if (walletAddress) {
      callGetter(walletAddress);
    } else {
      setAccountData(undefined);
    }
  }, [walletAddress]);

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
            (accountData?.isMinter ||
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
