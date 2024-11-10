"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Errors } from "@/lib/interfaces";
import { isEmpty } from "lodash";
import { UserAuthRegisterSchema } from "@/lib/zod";
import { signup } from "@/app/register/actions";
import Modal from "../modals/Modal";
import CheckEmail from "../auth/CheckEmail";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterEmailForm: React.FC = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatedPassword, setShowRepeatedPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  function showError(value: string | Errors) {
    setErrors(typeof value === "string" ? { message: value } : value);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRepeatedPasswordVisibility = () => {
    setShowRepeatedPassword(!showRepeatedPassword);
  };

  const onChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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

  const handleFormAction = async (formData: FormData) => {
    const newErrors: Errors = {};

    const { success: validationSuccess, error: validationError } =
      UserAuthRegisterSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        fullName: formData.get("fullName"),
      });

    if (!validationSuccess) {
      console.log(validationError);
      // Just return the first error encountered
      showError(validationError.errors[0].message);
      return;
    }

    showError("");

    const resp = await signup(formData);

    if (resp && resp.error) {
      newErrors.message = resp.error;
      setErrors(newErrors);
      return;
    }

    setOpenModal(true);
  };

  return (
    <>
      <Modal
        open={openModal}
        setOpen={(value) => {
          setOpenModal(value);
          router.push("/login");
        }}
      >
        <CheckEmail
          email={email}
          text="We sent you an confirm email to your account"
        />
      </Modal>
      <form
        action={handleFormAction}
        className="w-[606px] h-min p-6 relative bg-white rounded-[10px] rounded-tl-none flex-col justify-start items-center gap-8 inline-flex"
      >
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
                name="fullName"
                type="text"
                value={fullName}
                onChange={onChangeFullName}
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
                name="email"
                type="email"
                value={email}
                onChange={onChangeEmail}
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
                  name="password"
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
                  type={showRepeatedPassword ? "text" : "password"}
                  value={repeatedPassword}
                  onChange={onChangeRepeatedPassword}
                  placeholder="********"
                  className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans']"
                />
                <button
                  type="button"
                  onClick={toggleRepeatedPasswordVisibility}
                  className="absolute right-3 top-1/2"
                  tabIndex={-1}
                >
                  {showRepeatedPassword ? (
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
              <SubmitButton
                disable={isSubmitDisabled}
                label="Create Account"
                loadingLabel="Creating..."
              />
            </div>
            <div className="self-stretch justify-between items-center inline-flex">
              <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                Do you already have an account?
              </div>
              <Link
                href="/login"
                prefetch={true}
                className="text-[#333333] text-xs font-bold font-['Noto Sans']"
              >
                Login
              </Link>
            </div>
            <div className="self-stretch justify-between items-center inline-flex">
              <div className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                Forgot your password?
              </div>
              <Link
                href="/reset-password"
                prefetch={true}
                className="text-[#333333] text-xs font-bold font-['Noto Sans']"
              >
                Reset password
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegisterEmailForm;
