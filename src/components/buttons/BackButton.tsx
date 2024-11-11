import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      className="group flex items-center gap-1 text-light-gray text-normal hover:text-text-gray/90 capitalize z-10 relative"
      type="button"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 duration-300" />
      Go back
    </button>
  )
}
