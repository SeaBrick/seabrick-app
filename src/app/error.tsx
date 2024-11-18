"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
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
        <div>
          <p className="text-gray-500">Oops! Something went wrong!</p>
          <p>{error.message}</p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-block px-4 py-2 text-white bg-seabrick-blue rounded hover:bg-blue-600"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
