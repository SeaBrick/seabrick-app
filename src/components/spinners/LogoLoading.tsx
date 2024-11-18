import Image from "next/image";

interface LogoLoadingProps {
  height: number;
  width: number;
  label?: string;
}

const LogoLoading: React.FC<LogoLoadingProps> = ({ height, width, label }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Image container */}
      <div
        className={`relative w-[${width}px] h-[${height}px] overflow-hidden`}
      >
        {/* Static transparent image */}
        <Image
          src="/seabrick.svg"
          alt="Loading"
          className="w-full h-full"
          height={height}
          width={width}
        />

        {/* Moving bar effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-shimmer"
          style={{
            WebkitMask: "url(/seabrick.svg) no-repeat center",
            mask: "url(/seabrick.svg) no-repeat center",
            WebkitMaskSize: "",
            maskSize: "contain",
            width: "100%", // Make the gradient bar span beyond the image width for smooth entry/exit
            height: "100%",
          }}
        />
      </div>

      {/* Optional label */}
      {label && <p className="mt-2 text-sm text-gray-600">{label}</p>}
    </div>
  );
};

export default LogoLoading;
