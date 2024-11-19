import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import SubmitButton from "../buttons/SubmitButton";
import { PasswordResetSchema } from "@/lib/zod";
import { Errors } from "@/lib/interfaces";
import { resetPasswordAction } from "@/app/auth/reset/action";
import { toast } from "react-toastify";

const NewPasswordForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  function showError(value: string | Errors) {
    setErrors(typeof value === "string" ? { message: value } : value);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function newPasswordAction(formData: FormData) {
    const { success: validationSuccess, error: validationError } =
      PasswordResetSchema.safeParse({
        newPassword: formData.get("newPassword"),
        repeatedPassword: formData.get("repeatedPassword"),
      });

    if (!validationSuccess) {
      console.log(validationError);
      // Just return the first error encountered
      showError(validationError.errors[0].message);
      return;
    }

    showError("");

    const resp = await resetPasswordAction(formData);

    if (resp && resp.error) {
      showError(resp.error);
      return;
    }

    toast.success("Password changed succesfully");
  }

  return (
    <div className="w-[606px] h-[393px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
      <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
        <div className="text-dark-gray text-[15px] font-normal font-['Noto Sans']">
          Register
        </div>
        <div className="text-dark-gray text-4xl font-normal font-['Noto Sans']">
          Enter New Password
        </div>
      </div>
      <form
        action={newPasswordAction}
        className="self-stretch h-[229px] flex-col justify-start items-start gap-4 flex"
      >
        <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
          <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
              <label className="text-dark-gray text-xs font-normal font-['Noto Sans']">
                New Password
              </label>
              <div className="self-stretch h-11 px-[15px] py-2.5 bg-white rounded-[5px] border border-[#323232] justify-between items-center inline-flex relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
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
            </div>
            <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
              <label className="text-dark-gray text-xs font-normal font-['Noto Sans']">
                Repeat Password
              </label>
              <div className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 justify-between items-center inline-flex relative">
                <input
                  id="repeatedPassword"
                  name="repeatedPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password again"
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
            </div>
          </div>
        </div>
        <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex">
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-2 flex">
              <SubmitButton
                buttonClass="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex"
                label="Save new Password"
              ></SubmitButton>
            </div>
          </div>
        </div>

        <p className="text-red-500 text-sm">{errors.message}</p>
      </form>
    </div>
  );
};

export default NewPasswordForm;
