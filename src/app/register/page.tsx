"use client";
import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { Button } from "@headlessui/react";
import { Address, zeroAddress } from "viem";
import SubmitButton from "@/components/buttons/SubmitButton";
import RegisterEmailForm from "@/components/forms/RegisterEmail";
import RegisterWalletForm from "@/components/forms/RegisterWallet";
import type { Errors } from "@/lib/interfaces";

enum TabsIndex {
  EMAIL,
  WALLET,
}

export default function RegisterPage() {
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!email) newErrors.message = "Email is required";
    if (!password) newErrors.message = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { email, password });
      // Aquí puedes enviar el formulario o hacer una llamada a la API
    }
  };

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
            <Link prefetch={true} href="/register">
              Register with Email
            </Link>
          </Tab>
          <Tab
            className={`rounded-t-xl py-2 px-3 outline-none ${selectedIndex == TabsIndex.WALLET ? "bg-white" : "bg-gray-200 hover:bg-gray-300 shadow-inner"}`}
          >
            <Link prefetch={true} href="/register?tab=wallet">
              Register with Wallet
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
