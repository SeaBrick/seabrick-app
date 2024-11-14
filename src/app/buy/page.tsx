"use client";
import React, { useState } from "react";
import BuyWithStripe from "./BuyWithStripe";
import BuyNFTCrypto from "@/components/cards/BuyNFTCrypto";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

enum TabsIndex {
  STRIPE,
  CRYPTO,
}

export default function BuyPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(TabsIndex.CRYPTO);
  // const [selectedIndex, setSelectedIndex] = useState<number>(TabsIndex.STRIPE);

  return (
    <div className="w-1/2 mx-auto">
      <p className="text-black text-4xl font-normal font-['Noto Sans'] text-center my-8">
        Buy Seabrick
      </p>

      <TabGroup
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
        className="z-10 relative"
      >
        <TabList className="flex gap-4 px-5">
          <Tab
            className={`rounded-t-xl py-2 px-3 outline-none ${selectedIndex == TabsIndex.STRIPE ? "bg-white" : "bg-gray-200 hover:bg-gray-300 shadow-inner"}`}
          >
            <div className="flex items-center gap-x-1">
              <AtSymbolIcon className="size-4" />
              <div
                className={`${selectedIndex == TabsIndex.STRIPE ? "text-[#49414d]" : "text-[#8a8a8f]"} text-xl font-bold font-['Noto Sans'] leading-normal`}
              >
                Credit/Debit Card
              </div>
            </div>
          </Tab>
          <Tab
            className={`rounded-t-xl py-2 px-3 outline-none ${selectedIndex == TabsIndex.CRYPTO ? "bg-white" : "bg-gray-200 hover:bg-gray-300 shadow-inner"}`}
          >
            <div className="flex items-center gap-x-1">
              <AtSymbolIcon className="size-4" />
              <div
                className={`${selectedIndex == TabsIndex.CRYPTO ? "text-[#49414d]" : "text-[#8a8a8f]"} text-xl font-bold font-['Noto Sans'] leading-normal`}
              >
                Crypto
              </div>
            </div>
          </Tab>
        </TabList>
        <TabPanels className="px-5">
          <TabPanel className="-5">
            <BuyWithStripe />
          </TabPanel>
          <TabPanel className="-5">
            <BuyNFTCrypto />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
