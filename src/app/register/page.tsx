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

interface Errors {
  message?: string;
}

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
        className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[50px] rounded-br-[50px]"
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
        <TabList className="flex gap-4 mt-32">
          <Tab
            className={`rounded-full py-1 px-3 bg-white hover:bg-gray-200 active:bg-gray-400 ${selectedIndex == TabsIndex.EMAIL ? "outline outline-2 outline-offset-2" : ""}`}
          >
            <Link prefetch={true} href="/register">
              Register with Email
            </Link>
          </Tab>
          <Tab
            className={`rounded-full py-1 px-3 bg-white hover:bg-gray-200 active:bg-gray-400 ${selectedIndex == TabsIndex.WALLET ? "outline outline-2 outline-offset-2" : ""}`}
          >
            <Link prefetch={true} href="/register?tab=wallet">
              Register with Wallet
            </Link>
          </Tab>
        </TabList>
        <TabPanels className="">
          <TabPanel className="rounded-xl bg-seabrick-blue/5 p-5">
            <RegisterEmailForm />
          </TabPanel>
          <TabPanel className="rounded-xl bg-seabrick-blue/5 p-5">
            <RegisterWalletForm />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
