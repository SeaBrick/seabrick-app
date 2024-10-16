"use client";
import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

enum TabsIndex {
  DETAILS,
  TRANSACTIONS,
}

export default function AccountDetailsPage() {
  const { user } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(TabsIndex.DETAILS);

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    switch (tab) {
      case "transactions":
        setSelectedIndex(TabsIndex.TRANSACTIONS);
        break;
      default:
        setSelectedIndex(TabsIndex.DETAILS);
        break;
    }
  }, [tab]);

  return (
    <div className="w-1/2 mx-auto">
      <p className="text-3xl font-bold mb-8">Account</p>

      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className="flex gap-4">
          <Tab className="rounded-full py-1 px-3 focus:outline-none data-[selected]:bg-seabrick-blue/10 data-[hover]:bg-seabrick-blue/5 data-[selected]:data-[hover]:bg-seabrick-blue/10 data-[focus]:outline-1 data-[focus]:outline-white">
            <Link prefetch={true} href="/account">
              Account details
            </Link>
          </Tab>
          <Tab className="rounded-full py-1 px-3 focus:outline-none data-[selected]:bg-seabrick-blue/10 data-[hover]:bg-seabrick-blue/5 data-[selected]:data-[hover]:bg-seabrick-blue/10 data-[focus]:outline-1 data-[focus]:outline-white">
            <Link prefetch={true} href="/account?tab=transactions">
              Account transactions
            </Link>
          </Tab>
        </TabList>
        <TabPanels className="mt-3">
          <TabPanel className="rounded-xl bg-seabrick-blue/5 p-3">
            <AccountDetails />
          </TabPanel>
          <TabPanel className="rounded-xl bg-seabrick-blue/5 p-3">
            <AccountTransactions />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

const AccountDetails: React.FC = () => {
  return <>Account details</>;
};

const AccountTransactions: React.FC = () => {
  return <>Account transactions</>;
};
