import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import SubmitButton from "../buttons/SubmitButton"
export function ModalConfirm({
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  description,
  cancelMessage,
  confirmMessage,
  onConfirm,
  closeAll,
  openBack,
  loadingLabel
}: {
  title: string
  open: boolean
  description: ReactNode
  cancelMessage: string
  confirmMessage: string
  onConfirm: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  closeAll: Dispatch<SetStateAction<boolean>>
  openBack: Dispatch<SetStateAction<boolean>>
  loadingLabel?: string
}) {
  const [isSelfOpen, setSelfOpen] = useState(true)
  const handleConfirm = async (_formData: FormData) => {
    await onConfirm(true)
    setSelfOpen(false)
  }
  const handleCancel = () => {
    setSelfOpen(true)
    openBack(true)
  }
  return (
    <>
      {isSelfOpen && (
        <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh] w-full max-w-[638px] md:min-w-[450px] p-6 gap-6 flex flex-col">
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col text-left gap-4">
              <span className="text-dark-gray text-3xl font-normal font-['Noto Sans']">
                {title}
              </span>
              <span className="text-[#8a8a8f] text-base font-normal font-['Noto Sans']">
                {description}
              </span>
            </div>
            <div className="">
              <button
                className="w-[35px] h-[35px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
                onClick={() => closeAll(false)}
              >
                <XMarkIcon className="size-[1rem]" />
              </button>
            </div>
          </div>

          <form className="flex justify-end gap-3" action={handleConfirm}>
            <button
              className="text-dark-gray text-base font-normal font-['Noto Sans'] bg-[#efeff4] hover:bg-[#d9d9d9] active:bg-[#cccccc] rounded-[5px] p-3"
              onClick={handleCancel}
            >
              {cancelMessage}
            </button>
            <SubmitButton
              buttonClass="text-white text-base font-normal font-['Noto Sans'] bg-dark-gray hover:bg-[#555555] active:bg-[#222222] rounded-[5px] p-3 max-w-fit"
              label={confirmMessage}
              loadingLabel={loadingLabel}
            />
          </form>
        </div>
      )}
    </>
  )
}
// text-white text-base font-normal font-['Noto Sans'] bg-dark-gray hover:bg-[#555555] active:bg-[#222222] rounded-[5px] p-3
