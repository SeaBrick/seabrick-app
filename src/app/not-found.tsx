import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-24 bg-white rounded-lg shadow-xl flex flex-col gap-y-5">
        <h1 className="text-6xl font-bold text-seabrick-blue">404</h1>
        <div className="flex flex-col gap-y-4">
          <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
          <p className="mt-2 text-gray-500">
            Sorry, the page you are looking for does not exist.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="flex w-fit mx-auto items-center gap-x-2 px-4 py-2 text-white bg-seabrick-blue rounded hover:bg-seabrick-blue/85"
          >
            <HomeIcon className="size-5" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
