import React, { useState } from 'react';

const ResetPasswordForm: React.FC = () => {


    return(
        <div className="w-[606px] h-[366px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
            <div className="self-stretch h-[141px] flex-col justify-start items-center gap-4 flex">
                <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
                    <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Account</div>
                    <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Password Reset</div>
                </div>
                <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Montserrat']">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
            </div>
            <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                <label 
                htmlFor="email"
                className="text-[#333333] text-xs font-normal font-['Noto Sans']"
                >
                    Email
                </label>
                <div className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 justify-start items-center gap-2.5 inline-flex">
                    <div className="text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">Enter your email</div>
                </div>
            </div>
            <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-2 flex">
                        <div className="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
                            <div className="text-right text-white text-sm font-normal font-['Noto Sans']">Send Link</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm