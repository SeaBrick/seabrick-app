"use client";
import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import RegisterEmailForm from "@/components/forms/RegisterEmail";
import RegisterWalletForm from "@/components/forms/RegisterWallet";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

enum TabsIndex {
  EMAIL,
  WALLET,
}

// TODO: Add captchas
export default function RegisterPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(TabsIndex.EMAIL);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    switch (tab) {
      case "wallet":
        setSelectedIndex(TabsIndex.WALLET);
        break;
      default:
        setSelectedIndex(TabsIndex.EMAIL);
        break;
    }
  }, [tab]);

  return (
    <div className="w-full h-[80vh] md:h-screen relative bg-[#f6f6f6] flex justify-center">
      <Image
        className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[rounded-tl-none50px] rounded-br-[50px]"
        src={`/login-bg.png`}
        alt="banner"
        width={1920}
        height={414}
      />
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
        className="z-10"
      >
        <TabList className="flex gap-4 mt-32 px-5">
          <Tab
            className={`rounded-t-xl py-2 px-3 outline-none ${selectedIndex == TabsIndex.EMAIL ? "bg-white" : "bg-gray-200 hover:bg-gray-300 shadow-inner"}`}
          >
            <Link
              prefetch={true}
              className="flex items-center gap-x-1"
              href="/register"
            >
              <AtSymbolIcon className="size-4" />
              <span>Register with Email</span>
            </Link>
          </Tab>
          <Tab
            className={`rounded-t-xl py-2 px-3 outline-none ${selectedIndex == TabsIndex.WALLET ? "bg-white" : "bg-gray-200 hover:bg-gray-300 shadow-inner"}`}
          >
            <Link
              prefetch={true}
              className="flex items-center gap-x-1"
              href="/register?tab=wallet"
            >
              <Image
                src={`/wallet-icon.svg`}
                alt="user-image"
                height={16}
                width={16}
              />
              <span>Register with Wallet</span>
            </Link>
          </Tab>
        </TabList>
        <TabPanels className="px-5">
          <TabPanel className="-5">
            <RegisterEmailForm />
          </TabPanel>
          <TabPanel className="-5">
            <RegisterWalletForm />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
