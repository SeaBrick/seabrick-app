import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ReloadButtonProps {
  size?: `size-${string}`;
}
const ReloadButton: React.FC<ReloadButtonProps> = ({ size = "size-5" }) => {
  function reload() {
    window.location.reload();
  }

  return (
    <button
      onClick={reload}
      className="flex items-center gap-x-2 px-4 py-2 text-white bg-seabrick-green rounded hover:bg-seabrick-green/85"
    >
      <ArrowPathIcon className={size} />

      <span>Reload page</span>
    </button>
  );
};

export default ReloadButton;
