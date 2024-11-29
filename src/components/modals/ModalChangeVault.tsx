import { Dispatch, SetStateAction, useState } from "react"
import { ModalConfirm } from "./ModalConfirm"
import { ModalDone } from "./ModalDone"
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function ChangeVault({
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

  const [vault, setVault] = useState("");
  const [error, setError] = useState("");

  const printCancel = () => {    
    setOpen(false);
  };
  const handleConfirm = async () => {
    try {
      
      setOpenDone(true);
    } catch (error) {
      console.error(error);
      handleBack();
    }
  };

  const handleBack = () => {
    setSelfOpen(true);
    setConfirmOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = console.log('validate vault',vault);
    // if (validationError) {
    //   setError(validationError);
    //   return;
    // }
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
          title={"Vault Address Changed"}
          message={
            <p>
              Your app vault address was succesfully changed to{" "} <strong>{vault}</strong>. 
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
              Are you sure you want to transfer your app ownership to{" "}
              <strong>{vault}</strong>
            </p>
          }
          cancelMessage={"No, I want to go back"}
          confirmMessage={"Yes, I want to change to the new vault address"}
          open={isConfirmOpen}
          onConfirm={handleConfirm}
          setOpen={setConfirmOpen}
          closeAll={setOpen}
          openBack={handleBack}
          loadingLabel={"Changing..."}
        />
      )}
      {isSelfOpen && (
        <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh] w-full max-w-[638px] min-w-[450px] p-6 gap-8 flex flex-col">
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col text-left gap-2">
              <span className="text-dark-gray text-3xl font-normal font-['Noto Sans']">
                Change App Vault Address
              </span>
              <span className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                This function allows you to change the vault address where the funds received from purchases will be sent. By initiating this process, ensure that the new address is prepared to effectively manage the funds. Once the change is made, the new address will assume all responsibilities associated with managing the funds.
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
                htmlFor="Vault Address"
                className="text-dark-gray text-base font-normal font-['Noto Sans'] text-start"
              >
                Vault Address
              </label>
              <input
                name="vault"
                value={vault}
                onChange={(e) => setVault(e.target.value)}
                placeholder="Enter Vault Address"
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
