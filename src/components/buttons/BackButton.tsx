import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      className="group flex items-center gap-1 text-light-gray hover:text-white text-normal capitalize z-10 relative border border-light-gray hover:border-dark-gray/90 hover:bg-dark-gray  rounded-md p-2.5 px-3 duration-200 active:bg-dark-gray active:text-white"
      type="button"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 duration-300 group-hover:text-white group-active:text-white group-active:-translate-x-1" />
      Go back
    </button>
  )
}
