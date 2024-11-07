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

interface Errors {
    message?: string;
    
}

const RegisterWalletForm: React.FC = () => {

  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");  
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!email) newErrors.message = "Email is required";    

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { email});
      // Aquí puedes enviar el formulario o hacer una llamada a la API
    }
  };




    return (        
            <form  className="w-[606px] h-min p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex">
                <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
                    <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Register</div>
                    <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Create Account</div>
                </div>
                <div className="self-stretch h-min flex-col justify-start items-start gap-4 flex">
                    <div className="self-stretch flex-col justify-start items-start gap-4 flex">                         
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
                        </div>
                        <p className="text-red-500 text-xs" >{errors.message}</p>
                    </div>
                    <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
                        <div className="self-stretch h-[45px] justify-center items-start gap-4 inline-flex">
                            <button className="grow shrink max-w-[271px] basis-0 self-stretch p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
                                <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Create Account</span>
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
    );
};

export default RegisterWalletForm;