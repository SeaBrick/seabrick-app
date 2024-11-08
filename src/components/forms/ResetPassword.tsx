import React, { useState } from 'react';
import { useAuth } from "@/context/authContext";
import { isEmpty } from "lodash";

interface Errors {
    message?: string;
}

interface EmailProps {
    onConfirm: (email: string) => void;
}

const ResetPasswordForm: React.FC<EmailProps> = ({ onConfirm }) => {
    const [email, setEmail] = useState<string>("");
    const { refetch: authRefetch } = useAuth();
    const [errors, setErrors] = useState<Errors>({});
    
    async function loginFormAction(formData: FormData) {
        const newErrors: Errors = {};
        
        if (!email) newErrors.message = "Email is required";
        
        if (!isEmpty(newErrors)) {
            setErrors(newErrors);
            return;
        }
        
        await authRefetch();
    }

    const handleSendLink = () => {
        if (!email) {
            setErrors({ message: "Email is required" });
            return;
        }
        onConfirm(email); 
    };

    return (
        <div className="w-[606px] h-[366px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
            <div className="self-stretch h-[141px] flex-col justify-start items-center gap-4 flex">
                <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
                    <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Account</div>
                    <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Password Reset</div>
                </div>
                <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Montserrat']">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </div>
            </div>
            <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                <label htmlFor="email" className="text-[#333333] text-xs font-normal font-['Noto Sans']">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans'] placeholder-gray-500"
                />
                <p className="text-red-500 text-xs">{errors.message}</p>
            </div>
            <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-2 flex">
                        <button
                            type="button"
                            onClick={handleSendLink}
                            className="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex"
                        >
                            <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Send Link</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface CheckEmailProps {
    email: string;
}

const CheckEmail: React.FC<CheckEmailProps> = ({ email }) => {
    return (
        <div className="w-[606px] h-[399px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
            <div className="self-stretch h-[223px] flex-col justify-start items-center gap-4 flex">
                <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
                    <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">Account</div>
                    <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">Check your email!</div>
                </div>
                    <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Noto Sans']">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </div>
            </div>
            <div className="self-stretch h-24 flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch h-[19px] flex-col justify-center items-start gap-2 flex">
                    <div>
                        <span className="text-[#333333] text-sm font-normal font-['Noto Sans']">Email sent to </span>
                        <span className="text-[#333333] text-sm font-bold font-['Noto Sans']">{email}</span>
                    </div>
                </div>
                <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <button className="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex">
                            <span className="text-right text-white text-sm font-normal font-['Noto Sans']">Ok</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);

    return (
        <div>
            {email === null ? (
                <ResetPasswordForm onConfirm={setEmail} /> 
            ) : (
                <CheckEmail email={email} />
            )}
        </div>
    );
};

export default ResetPassword;
