import ColoredSpinner from "./ColoredSpinner";

interface PageLoaderSpinnerProps {
  height?: `h-${string}`;
  width?: `w-${string}`;
}

export default function PageLoaderSpinner({
  height = "h-20",
  width = "w-20",
}: PageLoaderSpinnerProps) {
  return (
    <div
      className={`flex content-center items-center justify-center mx-auto ${height} ${width}`}
    >
      <ColoredSpinner
        height={height}
        width={width}
        color="text-seabrick-blue my-auto"
      />
    </div>
  );
}
