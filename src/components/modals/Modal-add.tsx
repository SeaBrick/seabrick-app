import { Dispatch, SetStateAction, useState } from "react"
import { ModalConfirm } from "./ModalConfirm"
import { validateEmail } from "@/components/utils/ValidateEmail"
import { ModalDone } from "./ModalDone"
import { addAdmin } from "@/app/admin-list/requests";
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function AddAdminModal({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isSelfOpen, setSelfOpen] = useState(true);
  const [isOpenDone, setOpenDone] = useState(false);

  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const printCancel = () => {
    console.log("Cancel");
    setOpen(false);
  };
  const handleConfirm = async () => {
    try {
      await addAdmin(address)
      setOpenDone(true);
    } catch (error) {
      console.log(error);
      handleBack();
    }
  };

  const handleBack = () => {
    setSelfOpen(true);
    setConfirmOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateEmail(address);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setConfirmOpen(true);
    setSelfOpen(false);
  };

  const handleCancel = () => {
    printCancel();
    setOpen(false);
    setSelfOpen(false);
  };

  return (
    <>
      {isOpenDone && (
        <ModalDone
          title={"Confirmed"}
          message={
            <p>
              The new admin user {" "} <strong>{address}</strong> has been added successfully 
            </p>
          }
          action={setOpen}
        />
      )}
      {isConfirmOpen && (
        <ModalConfirm
          title={"Confirm your Action"}
          description={
            <p>
              Are you sure you want to add a new admin with the email address{" "}
              <strong>{address}</strong>
            </p>
          }
          cancelMessage={"No, I want to go back"}
          confirmMessage={"Yes, I want to add the new admin"}
          open={isConfirmOpen}
          onConfirm={handleConfirm}
          setOpen={setConfirmOpen}
          closeAll={setOpen}
          openBack={handleBack}
          loadingLabel={"Adding..."}
        />
      )}
      {isSelfOpen && (
        <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh] w-full max-w-[638px] min-w-[450px] p-6 gap-8 flex flex-col">
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col text-left gap-2">
              <span className="text-dark-gray text-3xl font-normal font-['Noto Sans']">
                Add Admin
              </span>
              <span className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                Please enter the details of the new admin you wish to add. Make sure to provide a valid email address. This action will grant the new admin access to manage the platform and its features.
              </span>
            </div>
            <div className="">
              <button
                className="w-[35px] h-[35px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
                onClick={handleCancel}
              >
                <XMarkIcon className="size-[1rem]" />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-y-4 w-full">
              <label
                htmlFor="email"
                className="text-dark-gray text-base font-normal font-['Noto Sans'] text-start"
              >
                Email
              </label>
              <input
                name="email"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Email"
                className="bg-gray-300 w-full py-2 px-4 rounded-md border border-[#8a8a8f] dark-gray-800"
              />
              {error && (
                <p className="text-[#ff0019] text-start text-base font-normal font-['Noto Sans']">
                  {error}
                </p>
              )}{" "}
              {/* error message */}
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="text-dark-gray text-base font-normal font-['Noto Sans'] bg-[#efeff4] hover:bg-[#d9d9d9] active:bg-[#cccccc] rounded-[5px] p-3"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="text-white text-base font-normal font-['Noto Sans'] bg-dark-gray hover:bg-[#555555] active:bg-[#222222] rounded-[5px] p-3"
                type="submit"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
