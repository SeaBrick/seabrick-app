import Link from "next/link";

function  NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-seabrick-blue">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
        <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-block px-4 py-2 text-white bg-seabrick-blue rounded hover:bg-blue-600">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default  NotFound;
