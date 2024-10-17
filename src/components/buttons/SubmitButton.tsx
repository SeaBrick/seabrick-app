import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text?: string;
}
export default function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none  hover:bg-gray-500"
    >
      {pending ? "Loading..." : text || "Submit"}
    </button>
  );
}
