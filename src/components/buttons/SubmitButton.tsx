"use client";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  disable?: boolean;
  buttonClass?: string;
}
export default function SubmitButton(props: SubmitButtonProps) {
  const {
    label,
    loadingLabel,
    disable,
    buttonClass = "grow shrink basis-0 self-stretch bg-seabrick-blue rounded-[5px] justify-center items-center gap-2.5 hover:bg-seabrick-blue/80",
  } = props;
  const sharedButtonClass =
    "disabled:cursor-not-allowed disabled:bg-gray-400 text-center text-white text-sm font-normal font-['Noto Sans']";
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disable}
      title={pending || disable ? "Not allowed" : undefined}
      className={`${sharedButtonClass} ${buttonClass}`}
    >
      {pending ? (loadingLabel ?? "Loading...") : label}
    </button>
  );
}
