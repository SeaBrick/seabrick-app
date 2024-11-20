import React, { useState } from "react";
import SubmitButton from "../buttons/SubmitButton";
import CheckEmail from "../auth/CheckEmail";
import { UserAuthSchema } from "@/lib/zod";
import { requestResetPassword } from "@/app/reset-password/action";

interface Errors {
  message?: string;
}

interface ResetPasswordFormProps {
  onConfirm: (email: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onConfirm }) => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  function showError(value: string | Errors) {
    setErrors(typeof value === "string" ? { message: value } : value);
  }

  async function resetPasswordFormAction(formData: FormData) {
    showError("");

    // Validate the formdata
    const { success: validationSuccess, error: validationError } =
      UserAuthSchema.omit({ password: true }).safeParse({
        email: formData.get("email"),
      });

    if (!validationSuccess) {
      showError(validationError.errors[0].message);
      return;
    }

    showError("");

    const resp = await requestResetPassword(formData);

    if (resp && resp.error) {
      showError(resp.error);
      return;
    }

    onConfirm(email);
  }

  return (
    <form action={resetPasswordFormAction}>
      <div className="w-[606px] h-[366px] p-6 bg-white rounded-[10px] flex-col justify-start items-center gap-8 inline-flex z-10 mt-[180px]">
        <div className="self-stretch h-[141px] flex-col justify-start items-center gap-4 flex">
          <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
            <div className="text-dark-gray text-[15px] font-normal font-['Noto Sans']">
              Account
            </div>
            <div className="textresetPasswordFormAction-dark-gray text-4xl font-normal font-['Noto Sans']">
              Password Reset
            </div>
          </div>
          <div className="self-stretch text-[#8a8a8f] text-sm font-normal font-['Montserrat']">
            If you have forgotten your password or wish to update it, simply enter your registered email address. You will receive a link in your email that will guide you through the process of creating a new password.
          </div>
        </div>
        <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
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
            className="self-stretch h-11 px-[15px] py-2.5 bg-[#efeff4]/60 rounded-[5px] border border-[#babcc3]/60 text-[#8a8a8f] text-sm font-normal font-['Noto Sans'] placeholder-gray-500"
          />
          <p className="text-red-500 text-xs">{errors.message}</p>
        </div>
        <div className="self-stretch h-[45px] flex-col justify-start items-center gap-4 flex">
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-2 flex">
              <SubmitButton
                label="Request reset"
                loadingLabel="Sending..."
                buttonClass="grow shrink basis-0 h-[45px] p-[17px] bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 flex"
              ></SubmitButton>
            </div>
          </div>
        </div>
      </div>
    </form>
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
