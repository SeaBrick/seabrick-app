import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ModalDone } from "./ModalDone"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
export function ModalConfirm({
  title,
  open,
  description,
  cancelMessage,
  confirmMessage,
  doneMessage,
  doneTitle,
  onConfirm,
  onCancel,
  closeAll,
  openBack,
}: {
  title: string
  open: boolean
  description: string
  cancelMessage: string
  confirmMessage: string
  doneMessage: string
  doneTitle: string
  onConfirm: Dispatch<SetStateAction<boolean>>
  onCancel: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  closeAll: Dispatch<SetStateAction<boolean>>
  openBack: Dispatch<SetStateAction<boolean>>
}) {
  const [isOpenDone, setOpenDone] = useState(false)
  const [isSelfOpen, setSelfOpen] = useState(true)
  useEffect(() => {
    console.log(isSelfOpen)
  })
  const handleConfirm = () => {
    onConfirm(true)
    setSelfOpen(false)
    setOpenDone(true)
  }
  const handleCancel = () => {
    setSelfOpen(false)
    openBack(true)
  }
  return (
    <>
      {isOpenDone && (
        <ModalDone title={doneTitle} message={doneMessage} action={closeAll} />
      )}
      {open && (
        <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh]  w-[40vw] min-w-[450px] p-6 gap-6 flex flex-col">
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col text-left gap-2">
              <span className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
                {title}
              </span>
              <span className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
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

          <div className="flex justify-end gap-3">
            <button
              className="text-[#333333] text-xs font-normal font-['Noto Sans'] bg-[#efeff4] hover:bg-[#d9d9d9] active:bg-[#cccccc] rounded-[5px] p-3"
              onClick={handleCancel}
            >
              {cancelMessage}
            </button>
            <button
              className="text-white text-xs font-normal font-['Noto Sans'] bg-[#333333] hover:bg-[#555555] active:bg-[#222222] rounded-[5px] p-3"
              onClick={handleConfirm}
            >
              {confirmMessage}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
