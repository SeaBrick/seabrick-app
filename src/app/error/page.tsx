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
    // <div className="flex justify-center">
    //   <div className="max-w-[978px] w-[80%] flex flex-col items-center mx-auto mt-[30px] relative">
    //     <h2 className="text-black text-3xl font-normal font-['Noto Sans'] text-center mb-8">
    //       Oops! Something went wrong!
    //     </h2>
    //   </div>
    // </div>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-seabrick-blue">Error</h1>
        <p className="mt-2 text-gray-500">Oops! Something went wrong!</p>
        <Link
          href="/"
          className="mt-6 inline-block px-4 py-2 text-white bg-seabrick-blue rounded hover:bg-blue-600"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
