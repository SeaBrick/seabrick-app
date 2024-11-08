import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const NewPasswordForm: React.FC = () => {

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


    return(
        <div className="w-[606px] h-[383px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
            <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
                <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Register</div>
                <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Enter New Password</div>
            </div>
            <div className="self-stretch h-[229px] flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
                    <div className="self-stretch h-[152px] flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                            <label className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                                New Password
                            </label>
                            <div className="self-stretch h-11 px-[15px] py-2.5 bg-white rounded-[5px] border border-[#323232] justify-between items-center inline-flex">
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
                                <div className="w-6 h-6 relative" />
                            </div>
                        </div>
                        <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                            <label className="text-[#333333] text-xs font-normal font-['Noto Sans']">
                                Repeat Password
                            </label>
                            <div className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 justify-between items-center inline-flex">
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
                                <div className="w-6 h-6 relative" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-2 flex">
                            <button className="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
                                <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Save new Password</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPasswordForm