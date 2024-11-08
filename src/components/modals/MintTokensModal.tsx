import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import { Dispatch, SetStateAction, useState } from "react"
import { ModalConfirm } from "./ModalConfirm"
import { validateEmail } from "./Modal-add"

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
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(0)

  const printCancel = () => {
    console.log("Cancel")
    setOpen(false)
  }
  const printConfirm = () => {
    console.log("Confirm")
  }

  const handleBack = () => {
    setSelfOpen(true)
    setConfirmOpen(false)
  }

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationError = validateEmail(email)
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
      {isConfirmOpen && (
        <ModalConfirm
          title={"Confirm Your Action"}
          description={`Are you sure you want to mint ${quantity} tokens to ${email}?`}
          cancelMessage={"No, I want to go back"}
          confirmMessage={"Yes, I want to mint it"}
          doneMessage={`Your succesfuly minted ${quantity} tokens to ${email}`}
          doneTitle={"Tokens Minted"}
          onCancel={handleCancel}
          onConfirm={printConfirm}
          open={isConfirmOpen}
          setOpen={setConfirmOpen}
          closeAll={setOpen}
          openBack={handleBack}
        />
      )}
      {isSelfOpen && (
        <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh] w-[40vw] min-w-[450px] p-6 gap-6 flex flex-col">
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col text-left gap-2">
              <span className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
                Mint Tokens
              </span>
              <span className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Delectus quas natus ut praesentium, nulla sed error officiis
                quo.
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
          <form onSubmit={handleConfirm} className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="grow shrink">
                <div className="text-[#333333] text-xs font-normal font-['Noto Sans'] text-start">
                  E-Mail or Wallet address
                </div>
                <div className="">
                  <input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="bg-[#efeff4]/60 w-full py-2 px-4 rounded-md border border-[#babcc3]/60 text-[#8a8a8f] text-xs"
                  />
                </div>
              </div>
              <div className="grow shrink">
                <div className="text-[#333333] text-xs font-normal font-['Noto Sans'] text-start">
                  Tokens Quantity
                </div>
                <div className="">
                  <input
                    type="number"
                    name="quantity"
                    className="bg-white w-full py-2 px-4 rounded-md border border-[#8a8a8f] text-[#333333] text-xs"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="text-[#333333] text-xs font-normal font-['Noto Sans'] bg-[#efeff4] hover:bg-[#d9d9d9] active:bg-[#cccccc] rounded-[5px] p-3"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="text-white text-xs font-normal font-['Noto Sans'] bg-[#333333] hover:bg-[#555555] active:bg-[#222222] rounded-[5px] p-3"
                type="submit"
              >
                Confirm
              </button>
            </div>
            {error && (
              <p className="text-[#ff0019] text-xs font-normal font-['Noto Sans']">
                {error}
              </p>
            )}{" "}
          </form>
        </div>
      )}
    </>
  )
}
