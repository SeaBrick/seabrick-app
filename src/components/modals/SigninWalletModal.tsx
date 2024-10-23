import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Container from "../utils/Container";
import Modal from "./Modal";
import { Checkbox, Description, Field } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { useFormState } from "react-dom";
import { useAuth } from "@/context/authContext";

interface SigninWalletModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  formAction: (
    currentState: {
      message: string;
    },
    formData: FormData
  ) => Promise<{
    message: string;
  }>;

  formData: FormData | undefined;
}
const SigninWalletModal: React.FC<SigninWalletModalProps> = ({
  open,
  setOpen,
  formAction,
  formData,
}: SigninWalletModalProps) => {
  const { refetch } = useAuth();

  const [enabled, setEnabled] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const hasRendered = useRef(false);

  const initMessageState = { message: "" };
  const [messageState, formActionState] = useFormState(
    formAction,
    initMessageState
  );

  useEffect(() => {
    if (hasRendered.current) {
      // This will run only on updates, not on the first render
      setMessage(messageState.message);
    }
  }, [messageState]);

  useEffect(() => {
    hasRendered.current = true;
  }, []);

  async function clickAction(formDataAction: FormData): Promise<void> {
    setMessage("");

    if (formData) {
      const email = formDataAction.get("email")?.toString() as string;
      const emailPromotions = formDataAction
        .get("email-promotions")
        ?.toString() as "on" | null;

      formData.set("email", email);
      if (emailPromotions) {
        formData.set("email-promotions", emailPromotions);
      }

      const resp = await formAction(initMessageState, formData);
      if (resp && resp.message) {
        setMessage(resp.message);
      }

      await refetch();
    }
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <Container>
        <div className="border rounded-md py-8 px-10 flex flex-col gap-y-4 w-[40rem] transition duration-100 ease-out">
          <h3 className="text-gray-700 text-2xl w-fit mx-auto">
            Link an email to you wallet address
          </h3>

          <p>You need to link an email address to your wallet address</p>
          <form className="flex flex-col gap-y-4 w-full" action={clickAction}>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="bg-gray-300 py-2 px-4 rounded-md border border-seabrick-green text-gray-800"
            />

            <Field className="flex items-center gap-x-2 justify-center">
              <Checkbox
                name="email-promotions"
                checked={enabled}
                onChange={setEnabled}
                className="group block size-4 rounded-md border border-seabrick-green bg-white data-[checked]:bg-seabrick-green "
              >
                <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block -mt-[1px]" />
              </Checkbox>

              <Description>
                I want to receive promotional emails from Seabrick (optional)
              </Description>
            </Field>

            <button
              className="bg-seabrick-green p-2 rounded-md text-white"
              type="submit"
            >
              Link email
            </button>
          </form>

          {message && <p className="text-red-500">{message}</p>}
        </div>
      </Container>
    </Modal>
  );
};

export default SigninWalletModal;
