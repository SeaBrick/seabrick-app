import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text?: string;
  disable: boolean;
}
export default function SubmitButton({ text, disable }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending || disable}
      title={pending || disable ? "No changes to save" : undefined}
      className="inline-flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none  hover:bg-gray-500"
    >
      {pending ? "Loading..." : text || "Submit"}
    </button>
  );
}
