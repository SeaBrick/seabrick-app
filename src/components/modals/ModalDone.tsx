import { Dispatch, ReactNode, SetStateAction } from "react"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"

export function ModalDone({
  title,
  message,
  action,
}: {
  title: string
  message: ReactNode
  action: Dispatch<SetStateAction<boolean>>
}) {
  const handleAction = () => {
    action(false)
  }
  return (
    <div className="bg-white rounded-[10px] h-fit min-h-fit max-h-[70vh]  w-[40vw] min-w-[450px] p-6 gap-6 flex flex-col">
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col text-left gap-2">
          <span className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
            {title}
          </span>
          <span className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
            {message}
          </span>
        </div>
        <div className="">
          <button
            className="w-[35px] h-[35px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
            onClick={handleAction}
          >
            <XMarkIcon className="size-[1rem]" />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="text-white text-xs font-normal font-['Noto Sans'] bg-[#333333] hover:bg-[#555555] active:bg-[#222222] rounded-[5px] p-3"
          onClick={handleAction}
        >
          Done
        </button>
      </div>
    </div>
  )
}
