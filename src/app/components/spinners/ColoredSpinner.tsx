import React from "react";

interface ColoredSpinnerProps {
  height: string;
  width: string;
  color: string;
}

// Uses tailwind's calsses for styles
const ColoredSpinner: React.FC<ColoredSpinnerProps> = ({
  height,
  width,
  color,
}) => {
  return (
    <>
      <div role="status" className={`${width} ${height}`}>
        <svg
          aria-hidden="true"
          //   className={`animate-spin inline ${width} ${height} ${color} `}
          className={`animate-spin inline ${color} w-full h-full`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default ColoredSpinner;
