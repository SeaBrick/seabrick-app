import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import DetailsTable from "./DetailsTable";

interface OrderDetailsProps {
  searchParams: {
    type: string;
    hash?: string;
    session_id?: string;
  };
}

export default async function OrderDetails({
  searchParams,
}: OrderDetailsProps) {
  const { type, hash, session_id } = searchParams;

//   try

  return (
    <div className="flex justify-center">
      <div className="max-w-[978px] w-[80%] flex flex-col items-center mx-auto mt-[30px] relative">
        <h2 className="text-black text-3xl font-normal font-['Noto Sans'] text-center mb-8">
          Order Details
        </h2>

        <DetailsTable />

        <Link
          href="/dashboard"
          prefetch={true}
          className="flex items-center gap-2 px-4 py-2 rounded mt-4 text-white bg-seabrick-blue hover:bg-seabrick-blue/80 self-end"
        >
          <span className="font-['Montserrat'] text-sm">Go to Home</span>
          <HomeIcon className="size-6" />
        </Link>
      </div>
    </div>
  );
}
