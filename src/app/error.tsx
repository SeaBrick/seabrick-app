"use client"; // Error boundaries must be Client Components

import ReloadButton from "@/components/buttons/ReloadButton";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-24 bg-white rounded-lg shadow-xl flex flex-col gap-y-5">
        <h1 className="text-5xl font-bold text-seabrick-blue">Error</h1>
        <div className="flex flex-col gap-y-4">
          <p className="text-gray-500">Oops! Something went wrong!</p>
          <p>{error.message}</p>
          <p className="text-gray-500">You can try reloading the page</p>
        </div>
        <div className="flex gap-x-4">
          <Link
            href="/"
            className="flex items-center gap-x-2 px-4 py-2 text-white bg-seabrick-blue rounded hover:bg-seabrick-blue/85"
          >
            <HomeIcon className="size-5" />
            <span>Go to Home</span>
          </Link>
          <ReloadButton />
        </div>
      </div>
    </div>
  );
}
