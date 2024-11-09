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
import { Errors } from "@/lib/interfaces";
import { isEmpty } from "lodash";

const RegisterEmailForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  function showError(value: string | Errors) {
    setErrors(typeof value === "string" ? { message: value } : value);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePasswords(e.target.value, repeatedPassword);
  };

  const onChangeRepeatedPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatedPassword(e.target.value);
    validatePasswords(e.target.value, password);
  };

  const validatePasswords = (
    newPassword: string,
    newRepeatedPassword: string
  ) => {
    if (isEmpty(newPassword) || isEmpty(newRepeatedPassword)) {
      // Disable submit if either password field is empty
      setIsSubmitDisabled(true);
      showError({});
    } else if (newPassword !== newRepeatedPassword) {
      // Error if different
      showError("Passwords are different");
      setIsSubmitDisabled(true);
    } else {
      // Enable submit if passwords match and are not empty
      showError({});
      setIsSubmitDisabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!email) {
      newErrors.message = "Email is required";
    } else if (!password) {
      newErrors.message = "Password is required";
    } // else if (password1 === password2) newErrors.message ="Both Passwords doesn't match"    @NaneezX idk como lo tengas en el Forms aqui tienes la validacion adalpta los datos

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { email, password });
      // Aquí puedes enviar el formulario o hacer una llamada a la API
    }
  };

  return (
    <form className="w-[606px] h-min p-6 relative bg-white rounded-[10px] rounded-tl-none flex-col justify-start items-center gap-8 inline-flex">
      <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
        <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">
          Register
        </div>
        <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">
          Create Account
        </div>
      </div>
      <div className="self-stretch h-[377px] flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch h-[236px] mb-6 flex-col justify-start items-start gap-4 flex">
          <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
            <label
              htmlFor="fullName"
              className="text-[#333333] text-xs font-normal font-['Noto Sans']"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter full name"
              className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
            />
          </div>
          <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
            <label
              htmlFor="email"
              className="text-[#333333] text-xs font-normal font-['Noto Sans']"
            >
              Email
            </label>
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
            <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex relative">
              <label
                htmlFor="password"
                className="text-[#333333] text-xs font-normal font-['Noto Sans']"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={onChangePassword}
                placeholder="********"
                className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-[#8a8a8f]" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-[#8a8a8f]" />
                )}
              </button>
            </div>
            <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex relative">
              <label
                htmlFor="repeatedPassword"
                className="text-[#333333] text-xs font-normal font-['Noto Sans']"
              >
                Repeat Password
              </label>
              <input
                id="repeatedPassword"
                type={showPassword ? "text" : "password"}
                value={repeatedPassword}
                onChange={onChangeRepeatedPassword}
                placeholder="********"
                className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-[#8a8a8f]" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-[#8a8a8f]" />
                )}
              </button>
            </div>
          </div>
          <p className="text-red-500 text-sm">{errors.message}</p>
        </div>
        <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
          <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
            <button className="grow shrink basis-0 self-stretch p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
              <span className="text-right text-white text-sm font-normal font-['Noto Sans']">
                Create Account
              </span>
            </button>
          </div>
          <div className="self-stretch justify-between items-center inline-flex">
            <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
              Do you already have an account?
            </div>
            <button className="text-[#333333] text-xs font-bold font-['Noto Sans']">
              Log In
            </button>
          </div>
          <div className="self-stretch justify-between items-center inline-flex">
            <button className="text-[#333333] text-xs font-normal font-['Noto Sans']">
              Forgot your password?
            </button>
            <button className="text-[#333333] text-xs font-bold font-['Noto Sans']">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterEmailForm;
