import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import { Dispatch, ReactNode, SetStateAction } from "react"
export default function ClaimModal({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  open,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpen,
  title,
  children,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  children: ReactNode
}) {
  return (
    <>
      <div className="bg-white rounded-[10px] h-fit min-h-[300px] max-h-[70vh] w-[40vw] min-w-[450px] p-6 gap-6 flex flex-col">
        <div className="flex gap-2 justify-between">
          <div className="flex flex-col text-left gap-2">
            <span className="text-[#333333] text-3xl font-normal font-['Noto Sans']">
              Claim {title}
            </span>
            <span className="text-[#8a8a8f] text-xs font-normal font-['Noto Sans']">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
              quas natus ut praesentium, nulla sed error officiis quo.
            </span>
          </div>
          <div className="">
            <button
              className="w-[35px] h-[35px] rounded-full border border-[#9b9a9b]/60 flex justify-center items-center hover:bg-slate-50 active:bg-slate-200"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="size-[1rem]" />
            </button>
          </div>
        </div>
        {children}
        <div className="flex justify-end">
          <button
            className="text-[#333333] text-sm font-normal font-['Noto Sans'] bg-[#efeff4] hover:bg-[#d9d9d9] active:bg-[#cccccc] rounded-[5px] p-3"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
