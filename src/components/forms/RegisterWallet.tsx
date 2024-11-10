"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRejectedRequestError } from "viem";
import SubmitButton from "@/components/buttons/SubmitButton";
import ConnectButton from "../buttons/ConnectButton";
import { useAccount, useSignMessage } from "wagmi";
import { UserRegisterWalletSchema } from "@/lib/zod";
import Modal from "../modals/Modal";
import CheckEmail from "../auth/CheckEmail";
import { signUpWithWallet } from "@/app/register/actions";
import Link from "next/link";

interface Errors {
  message?: string;
}

const RegisterWalletForm: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // TODO: Show not "installed wallet"
  const [haveWallet, setHaveWallet] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (window.ethereum) {
      setHaveWallet(true);
    }
  }, []);

  useEffect(() => {
    showError("");
  }, [isConnected, address]);

  function showError(value: string | Errors) {
    setErrors(typeof value === "string" ? { message: value } : value);
  }

  async function handleSubmit(formData: FormData) {
    // We skip the `signature` at this point since is not signed yet
    const {
      data: validationData,
      success: validationSuccess,
      error: validationError,
    } = UserRegisterWalletSchema.omit({ signature: true }).safeParse({
      email: formData.get("email")?.toString(),
      address: formData.get("address")?.toString(),
    });

    if (!validationSuccess) {
      // Just return the first error encountered
      showError(validationError.errors[0].message);
      return;
    }

    const params = new URLSearchParams({ address: validationData.address });
    const response = await fetch(`/api/request_message?${params}`, {
      method: "GET",
    });

    if (!response.ok) {
      showError("Failed to generate message to sign");
      return;
    }

    // Since the response is ok, we safely get the message
    const messageGenerated = (await response.json()).message;

    try {
      // Ask the user to sign the message
      const messageSigned = await signMessageAsync({
        message: messageGenerated,
      });

      // Store signed message in formData
      formData.set("signature", messageSigned);
    } catch (error) {
      // If some error happened, we cancel the submission
      let errorMessage = "Unknown error found";

      if (error instanceof UserRejectedRequestError) {
        errorMessage = "User rejected the request";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.log(error);
      }

      showError(errorMessage);
      return;
    }

    showError("");

    const resp = await signUpWithWallet(formData);
    if (resp && resp.error) {
      showError(resp.error);
      return;
    }

    setOpenModal(true);
  }

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
      <div className="w-[606px] h-min p-6 relative bg-white rounded-[10px] rounded-tl-none flex-col justify-start items-center gap-8 inline-flex">
        <div className="h-[74px] flex-col justify-center items-center gap-[5px] flex">
          <div className="text-[#333333] text-[15px] font-normal font-['Noto Sans']">
            Register Wallet
          </div>
          <div className="text-[#333333] text-4xl font-normal font-['Noto Sans']">
            Create Account
          </div>
        </div>

        <div className="mx-auto w-fit">
          <ConnectButton />
        </div>

        <form
          className="w-full gap-8 inline-flex flex-col"
          action={handleSubmit}
        >
          <div className="self-stretch h-min flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
              <div className="self-stretch h-[68px] flex-col justify-center items-start gap-2 flex">
                <input
                  id="address"
                  name="address"
                  type="text"
                  hidden
                  readOnly
                  value={address ?? ""}
                  className="disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="email"
                  className="text-[#333333] text-xs font-normal font-['Noto Sans']"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  // required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="self-stretch h-11 px-[15px] py-2.5 rounded-[5px] border border-[#333333] text-[#333333] text-sm font-normal font-['Noto Sans'] bg-[#efeff4]/60"
                />
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex"></div>
              <p className="text-red-500 text-xs">{errors.message}</p>
            </div>
            <div className="self-stretch h-[109px] flex-col justify-start items-center gap-4 flex">
              <div className="self-stretch h-[45px] justify-start items-start gap-4 inline-flex">
                <SubmitButton
                  disable={!isConnected}
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
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterWalletForm;
