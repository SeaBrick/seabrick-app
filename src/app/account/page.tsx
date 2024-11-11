"use client";
import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { Button } from "@headlessui/react";
import { Address, zeroAddress } from "viem";
import { changeAccountDetails } from "./actions";
import SubmitButton from "@/components/buttons/SubmitButton";
import ChangePasswordForm from "@/components/forms/ChangePassword";

enum TabsIndex {
  DETAILS,
  TRANSACTIONS,
}

export default function AccountDetailsPage() {
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
    <div className="max-w-[978px] w-full mx-auto mt-[30px]">
      <p className="text-md text-center">Account</p>
      <h3 className="text-4xl text-center mb-9">Account Settings</h3>

      <div className="w-full p-5 bg-white rounded-[10px] flex-col justify-center items-center gap-4 inline-flex mb-4">
        <div className="self-stretch flex-col justify-start items-start gap-[30px] flex">
            <div className="self-stretch items-center justify-center gap-3 flex flex-col">
                <div className="w-[90px] h-[90px] relative">
                    <Image className="w-[90px] h-[90px] left-0 top-0 absolute rounded-full object-cover" src="/user-no-profile.webp" width={90} height={90} alt="img-user"/>
                </div>
                <div className="grow shrink basis-0 flex-col justify-start items-center gap-2 inline-flex">
                    <h3 className="text-[#49414d] text-xl font-bold font-['Noto Sans'] leading-normal">Sebastian Rojas</h3>
                </div>
            </div>
        </div>
      </div>
      {/* Tabs 
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
          <TabPanel className="rounded-xl bg-seabrick-blue/5 p-5">
            <AccountDetails />
          </TabPanel>
          <TabPanel className="rounded-xl bg-seabrick-blue/5 p-5">
            <AccountTransactions />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      */}
      <div className="p-6 bg-white rounded-[10px]">
        <AccountDetails />
      </div>
      
    </div>
  );
}

const AccountDetails: React.FC = () => {
  const { user, userType } = useAuth();
  const [modifying, setModifying] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>("");

  const [address, setAddress] = useState<Address>(zeroAddress);
  const [originalAddress, setOriginalAddress] = useState<Address>(zeroAddress);

  const initMessageState = { message: "" };
  const [messageState, changeDetailsAction] = useFormState(
    formAction,
    initMessageState
  );

  async function formAction(
    currentState: {
      message: string;
    },
    data: FormData
  ) {
    const resp = await changeAccountDetails(currentState, data);

    if (resp.message.includes("User details updated")) {
      setOriginalEmail(email);
      setOriginalName(name);
      setOriginalAddress(address);
      setModifying(false);
    }

    return resp;
  }

  useEffect(() => {
    if (user) {
      if (user.email) {
        setEmail(user.email);
        setOriginalEmail(user.email);
      }

      if (user.user_metadata.name) {
        setName(user.user_metadata.name);
        setOriginalName(user.user_metadata.name);
      }

      // TODO: Support for 'email' account with linked wallet
      if (userType == "wallet") {
        // We can include the wallet
        setAddress(user.user_metadata.address);
        setOriginalAddress(user.user_metadata.address);
      }
    }
  }, [user, userType]);

  const handleModify = () => {
    setModifying(true);
  };

  const cancelModify = () => {
    restoreOriginalValues();
    setModifying(false);
    messageState.message = "";
  };

  const emailOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const nameOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const restoreOriginalValues = () => {
    setEmail(originalEmail);
    setName(originalName);
    setAddress(originalAddress);
  };

  const checkChanges = () => {
    return (
      originalEmail === email &&
      originalName === name &&
      originalAddress === address
    );
  };

  return (
    <div className="">
      {user && (
        <form className="flex flex-col gap-y-4" action={changeDetailsAction}>
          <h3 className="text-xl font-bold leading-6">Personal Information</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="md:w-1/2">
              <label className="block text-[#333333] text-xs font-normal ">
                Full Name 
              </label>
              <input
                className="disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-seabrick-blue/10 mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Your name (optional information)"
                disabled={!modifying}
                value={name}
                onChange={nameOnchange}
                name="name"
              />
            </div>

            <div className="md:w-1/2">
              <label className="block text-[#333333] text-xs font-normal ">Email</label>
              <input
                className="disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-seabrick-blue/10 mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500"
                disabled={!modifying}
                value={email}
                required
                onChange={emailOnchange}
                name="email"
              />
            </div>
          </div>
          <input hidden value={userType} name="user_type" />

          {userType === "wallet" && (
            <div>
              <label className="block">Wallet address</label>
              <input
                className="disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-seabrick-blue/10 mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500"
                // disabled={!modifying}
                disabled
                required
                value={address}
                onChange={emailOnchange}
                name="address"
              />
            </div>
          )}

          {modifying ? (
            <div className="flex gap-x-4 justify-end">
              <SubmitButton disable={checkChanges()} label="Save" />
              <Button
                type="button"
                onClick={cancelModify}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-400 data-[open]:bg-red-400 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-x-4 justify-end">
              <Button
                type="button"
                onClick={handleModify}
                className="inline-flex items-center gap-2 rounded-md bg-[#2069a0] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white w-fit "
              >
                Modify
              </Button>
            </div>
          )}

          {messageState.message && (
            <p className="text-red-500">{messageState.message}</p>
          )}
        </form>
        
      )}
      <hr className="my-6" />

      <ChangePasswordForm/>
    </div>
  );
};

const AccountTransactions: React.FC = () => {
  const { user } = useAuth();

  return <div>{user && <>Account transactions</>}</div>;
};
