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
import ChangePasswordForm from "@/components/forms/ChangePassword";


interface Errors {
    email?: string;
    password?: string;
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

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { email, password });
      // Aquí puedes enviar el formulario o hacer una llamada a la API
    }
  };


    return (
        <div className="w-full h-[80vh] md:h-screen relative bg-[#f6f6f6] flex justify-center">
            <Image className="w-full h-[200px] md:h-[414px] left-0 top-1 absolute z-0 rounded-bl-[50px] rounded-br-[50px]" src={`/login-bg.png`} alt="banner" width={1920} height={414}/>
            <form  className="h-[531px] p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex">
                <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
                    <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Register</div>
                    <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Create Account</div>
                </div>
                <div className="self-stretch h-[377px] flex-col justify-start items-start gap-4 flex">
                    <div className="self-stretch h-[236px] flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                            <label htmlFor="fullName" className="text-[#333333] text-xs font-normal font-['Noto Sans']">Full Name</label>   
                            <input
                            id="fullName"
                            type="text"
                            placeholder="Enter full name"
                            className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
                            />
                        </div>
                        <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                            <label htmlFor="email" className="text-[#333333] text-xs font-normal font-['Noto Sans']">Email</label>
                            <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="self-stretch h-11 px-[15px] py-2.5 rounded-[5px] border border-[#333333] text-[#333333] text-sm font-normal font-['Noto Sans'] bg-[#efeff4]/60"                            
                            />
                        </div>
                        <div className="self-stretch justify-start items-start gap-4 inline-flex">
                            <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex">
                                <label htmlFor="password" className="text-[#333333] text-xs font-normal font-['Noto Sans']">Password</label>
                                <input
                                id="password"
                                type="password"
                                placeholder="********"
                                className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
                                />
                                <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-[#8a8a8f]" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-[#8a8a8f]" />
                                )}
                                </button>
                            </div>
                            <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex">
                                <label htmlFor="repeatPassword" className="text-[#333333] text-xs font-normal font-['Noto Sans']">Repeat Password</label>
                                <input
                                id="repeatPassword"
                                type="password"
                                placeholder="********"
                                className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
                                />
                                <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-[#8a8a8f]" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-[#8a8a8f]" />
                                )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
                        <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                            <button className="grow shrink basis-0 self-stretch p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
                                <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Create Account</span>
                            </button>
                            <button className="grow shrink basis-0 h-[45px] p-[17px] bg-[#333333] rounded-[5px] justify-center items-center gap-2.5 flex">
                                <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Connect using your Wallet</span>
                            </button>
                        </div>
                        <div className="self-stretch justify-between items-center inline-flex">
                            <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">Do you already have an account?</div>
                            <button className="text-[#333333] text-xs font-bold font-['Noto Sans']">Log In</button>
                        </div>
                        <div className="self-stretch justify-between items-center inline-flex">
                            <button className="text-[#333333] text-xs font-normal font-['Noto Sans']">Forgot your password?</button>
                            <button className="text-[#333333] text-xs font-bold font-['Noto Sans']">Reset Password</button>
                        </div>
                    </div>
                </div>
            </form>           
        </div>
    );
}