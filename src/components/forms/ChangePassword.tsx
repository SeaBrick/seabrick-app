import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { changePassword } from "@/app/account/actions";
import SubmitButton from "../buttons/SubmitButton";
import { PasswordResetSchema, UserChangePassword } from "@/lib/zod";

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (inputId: string) => {
    switch (inputId) {
      case "current-password":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new-password":
        setShowNewPassword(!showNewPassword);
        break;
      case "repeated-password":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const getPasswordVisibilityIcon = (inputId: string) => {
    switch (inputId) {
      case "current-password":
        return showCurrentPassword ? (
          <EyeIcon className="h-6 w-6 text-gray-400" />
        ) : (
          <EyeSlashIcon className="h-6 w-6 text-gray-400" />
        );
      case "new-password":
        return showNewPassword ? (
          <EyeIcon className="h-6 w-6 text-gray-400" />
        ) : (
          <EyeSlashIcon className="h-6 w-6 text-gray-400" />
        );
      case "repeated-password":
        return showConfirmPassword ? (
          <EyeIcon className="h-6 w-6 text-gray-400" />
        ) : (
          <EyeSlashIcon className="h-6 w-6 text-gray-400" />
        );
      default:
        return null;
    }
  };

  // TODO: ADd toastify
  const pve = async (formData: FormData) => {
    console.log("clink");
    const resp = await changePassword(formData);
    console.log(resp);
  };

  return (
    <form
      action={pve}
      className="pb-6 max-w-[978px] w-full mx-auto flex flex-col gap-y-4"
    >
      <h3 className="text-xl font-bold leading-6">Change Password</h3>
      <div className="mb-4">
        <label
          className="block text-[#333333] text-xs font-normal mb-2"
          htmlFor="current-password"
        >
          Current Password
        </label>
        <div className="relative">
          <input
            className="mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500"
            id="current-password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => togglePasswordVisibility("current-password")}
          >
            {getPasswordVisibilityIcon("current-password")}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="mb-4 md:w-1/2">
          <label
            className="block text-[#333333] text-xs font-normal mb-2"
            htmlFor="new-password"
          >
            New Password
          </label>
          <div className="relative">
            <input
              className="mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500"
              id="new-password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility("new-password")}
            >
              {getPasswordVisibilityIcon("new-password")}
            </div>
          </div>
        </div>

        <div className="mb-4 md:w-1/2">
          <label
            className="block text-[#333333] text-xs font-normal mb-2"
            htmlFor="repeated-password"
          >
            Repeat New Password
          </label>
          <div className="relative">
            <input
              className="mt-1 block w-full bg-seabrick-blue/5 border border-gray-700 rounded py-2 px-4 focus:outline-none focus:ring focus:ring-blue-500"
              id="repeated-password"
              name="repeatedPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility("repeated-password")}
            >
              {getPasswordVisibilityIcon("repeated-password")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div>
          <SubmitButton
            buttonClass="inline-flex items-center gap-2 rounded-md bg-[#2069a0] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
            label="Change Password"
            loadingLabel="Changing.."
          />
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
