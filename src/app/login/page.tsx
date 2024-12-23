"use client";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { login } from "./actions";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import SubmitButton from "@/components/buttons/SubmitButton";
import { isEmpty } from "lodash";
import LoginWallet from "./LoginWallet";
import { useSearchParams } from "next/navigation";
import type { Errors } from "@/lib/interfaces";
import { LoginBanner } from "@/components/layout/LoginBanner";

export default function LoginPage() {
  const { refetch: authRefetch } = useAuth();
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [loginWallet, setLoginWallet] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    switch (tab) {
      case "wallet":
        setLoginWallet(true);
        break;
      default:
        break;
    }
  }, [tab]);

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function loginFormAction(formData: FormData) {
    const newErrors: Errors = {};

    if (!email) {
      newErrors.message = "Email is required";
    } else if (!password) {
      newErrors.message = "Password is required";
    }

    // if errors is NOT empty, somethins is missing. We do not try to login
    // Maube use a tostify here?
    if (!isEmpty(newErrors)) {
      setErrors(newErrors);
      return;
    }

    const resp = await login(formData);

    if (resp && resp.error) {
      newErrors.message = resp.error;
      setErrors(newErrors);
      return;
    }

    // Refetch the user
    await authRefetch();
  }

  return (
    <>
      <LoginWallet open={loginWallet} setOpen={setLoginWallet} />
      <LoginBanner />
      <div className="flex justify-center">
        <form
          action={loginFormAction}
          className="h-[339px] md:h-[447px] w-[350px] md:w-[606px] mt-[40px] md:mt-[180px] p-6 relative bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10"
        >
          <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
            <div className="text-dark-gray text-[15px] font-normal font-['Noto Sans']">
              Authentication
            </div>
            <div className="text-dark-gray text-4xl font-normal font-['Noto Sans']">
              Log In
            </div>
          </div>

          <div className="self-stretch h-[293px] flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="email"
                    className="text-dark-gray text-xs font-normal font-['Noto Sans']"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="self-stretch h-11 px-[15px] py-2.5 rounded-[5px] border border-dark-gray text-dark-gray text-sm font-normal font-['Noto Sans'] bg-[#efeff4]/60 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="password"
                    className="text-dark-gray text-xs font-normal font-['Noto Sans']"
                  >
                    Password
                  </label>
                  <div className="relative self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 flex items-center justify-between">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-transparent text-[#8a8a8f] text-sm font-normal font-['Noto Sans'] w-full outline-none"
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
                  <p className="text-red-500 text-sm">{errors.message}</p>
                </div>
              </div>
            </div>

            <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
              <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                <SubmitButton label="Log In" loadingLabel="Login..." />

                {haveWallet && (
                  <button
                    onClick={() => setLoginWallet(true)}
                    type="button"
                    className="grow shrink basis-0 h-[45px] p-[17px] bg-dark-gray hover:bg-dark-gray/80 rounded-[5px] justify-center items-center gap-2.5 flex disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <span className="text-right text-white text-sm font-normal font-['Noto Sans']">
                      Connect using your Wallet
                    </span>
                  </button>
                )}
              </div>

              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-dark-gray text-xs font-normal font-['Noto Sans']">
                  Do you want to create an account?
                </div>
                <Link
                  href="/register"
                  prefetch={true}
                  className="text-dark-gray text-xs font-bold font-['Noto Sans']"
                >
                  Register
                </Link>
              </div>
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-dark-gray text-xs font-normal font-['Noto Sans']">
                  Forgot your password?
                </div>

                <Link
                  href="/reset-password"
                  prefetch={true}
                  className="text-dark-gray text-xs font-bold font-['Noto Sans']"
                >
                  Reset Password
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
