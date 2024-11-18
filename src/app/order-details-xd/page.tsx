import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import DetailsTable, { type DetailsTableProps } from "./DetailsTable";
import { isHash } from "viem";
import { getBuysByTransaction } from "@/lib/subgraph";
import { redirect } from "next/navigation";

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

  // Functions getter to obtain the data
  // And alse we define the const/object for the table colums
  let tableData: DetailsTableProps;

  try {
    if (type === "crypto") {
      if (!hash || !isHash(hash)) {
        throw new Error("Invalid hash for Crypto transaction");
      }
      // Perform for crypto
      const resp = await getBuysByTransaction(hash);

      // No response data
      if (resp === null || resp.length === 0) {
        throw new Error("No data found for this transaction hash");
      }

      // Total amount (plus all the Buys at the same tx hash)
      let totalAmountPaid = 0n;
      const tokensId = resp.map((buy_) => {
        // Increasing to know the total amount paid
        totalAmountPaid = totalAmountPaid + BigInt(buy_.amountPaid);

        return buy_.tokenId;
      });

      tableData = {
        type,
        txHash: hash,
        paymentToken: resp[0].paymentToken,
        totalAmountPaid,
        tokensId,
        blockNumber: resp[0].blockNumber,
        blockTimestamp: resp[0].blockTimestamp,
        buysData: resp,
      };
    }
    //
    else if (type === "stripe") {
      if (!session_id) {
        throw new Error("Invalid ID Stripe transaction");
      }

      tableData = {
        type,
        tokensId: [""],
      };

      // Perform for stripe
    }
    //
    else {
      throw new Error("Invalid transaction");
    }

    //
  } catch (error) {
    throw error;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[978px] w-[80%] flex flex-col items-center mx-auto mt-[30px] relative">
        <h2 className="text-black text-3xl font-normal font-['Noto Sans'] text-center mb-8">
          Order Details
        </h2>

        <DetailsTable {...tableData} />

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
