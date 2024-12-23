import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import { Dispatch, SetStateAction, useState } from "react"
import { ModalConfirm } from "./ModalConfirm"
import { validateEmail } from "@/components/utils/ValidateEmail"
import { ModalDone } from "./ModalDone"
import { mintTokens } from "@/app/dashboard/requests"

export function MintTokensModal({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [isSelfOpen, setSelfOpen] = useState(true)
  const [isOpenDone, setOpenDone] = useState(false)

  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(0)

  const printCancel = () => {
    console.log("Cancel")
    setOpen(false)
  }
  const handleConfirm = async () => {
    try {
      await mintTokens(address, quantity)
      setOpenDone(true)
    } catch (error) {
      console.log(error)
      handleBack()
    }
  }

  const handleBack = () => {
    setSelfOpen(true)
    setConfirmOpen(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationError = validateEmail(address)
    if (validationError) {
      setError(validationError)
      return
    }
    if (isNaN(quantity)) {
      setError("Please enter a valid amount")
      return
    }
    setError("")
    setConfirmOpen(true)
    setSelfOpen(false)
  }

  const handleCancel = () => {
    printCancel()
    setOpen(false)
    setSelfOpen(false)
  }

  return (
    <>
      {isOpenDone && (
        <ModalDone
          title={"Tokens Minted"}
          message={
            <p>
              Your succesfuly minted <strong>{quantity}</strong> tokens to{" "}
              <strong>{address}</strong>
            </p>
          }
          action={setOpen}
        />
      )}
      {isConfirmOpen && (
        <ModalConfirm
          title={"Confirm Your Action"}
          description={
            <p>
              Are you sure you want to mint <strong>{quantity}</strong> tokens
              to <strong>{address}</strong>
            </p>
          }
          cancelMessage={"No, I want to go back"}
          confirmMessage={"Yes, I want to mint it"}
          open={isConfirmOpen}
          onConfirm={handleConfirm}
          setOpen={setConfirmOpen}
          closeAll={setOpen}
          openBack={handleBack}
          loadingLabel={"Minting..."}
        />
      )}
      {isSelfOpen && (
        <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh] w-full max-w-[638px] md:min-w-[450px] p-6 gap-8 flex flex-col">
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col text-left gap-2">
              <span className="text-dark-gray text-3xl font-normal font-['Noto Sans']">
                Mint Tokens
              </span>
              <span className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                This feature allows you to mint new tokens on the blockchain. By minting tokens, you can create unique digital assets that can represent anything from currency to collectibles. 
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
            <div className="flex gap-2">
              <div className="grow shrink">
                <div className="text-dark-gray text-base font-normal font-['Noto Sans'] text-start">
                  E-Mail or Wallet address
                </div>
                <div className="">
                  <input
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Email"
                    className="bg-[#efeff4]/60 w-full py-2 px-4 rounded-md border border-[#babcc3]/60 text-[#8a8a8f] text-base"
                  />
                </div>
              </div>
              <div className="grow shrink">
                <div className="text-dark-gray text-base font-normal font-['Noto Sans'] text-start">
                  Tokens Quantity
                </div>
                <div className="">
                  <input
                    type="number"
                    name="quantity"
                    className="bg-white w-full py-2 px-4 rounded-md border border-[#8a8a8f] text-dark-gray text-base"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>
              </div>
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
            {error && (
              <p className="text-[#ff0019] text-base font-normal font-['Noto Sans']">
                {error}
              </p>
            )}{" "}
          </form>
        </div>
      )}
    </>
  )
}
