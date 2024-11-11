"use client"
import { ReactElement } from "react"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  label: string
  loadingLabel?: string
  disable?: boolean
  disabledTitle?: string
  buttonClass?: string
  buttonIcon?: ReactElement<any, any>
}
export default function SubmitButton(props: SubmitButtonProps) {
  const {
    label,
    loadingLabel,
    disable,
    disabledTitle,
    buttonClass,
    buttonIcon,
  } = props
  const sharedButtonClass =
    "grow shrink basis-0 self-stretch bg-[#2069a0] rounded-[5px] justify-center items-center gap-2.5 hover:bg-[#2069a0]/80 disabled:cursor-not-allowed disabled:bg-gray-400 text-center text-white text-sm font-normal font-['Noto Sans'] flex justify-center"
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || disable}
      title={pending || disable ? (disabledTitle ?? "Not allowed") : undefined}
      className={`${sharedButtonClass} ${buttonClass}`}
    >
      {buttonIcon ?? ""}
      {pending ? (loadingLabel ?? "Loading...") : label}
    </button>
  )
}
