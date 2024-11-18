import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import DetailsTable, { type DetailsTableProps } from "./DetailsTable";
import { type Hex, isHash } from "viem";
import { getBuysByTransaction } from "@/lib/subgraph";
import { createClient } from "@/lib/supabase/server";
import { getUrl } from "@/lib/utils";
import { headers } from "next/headers";

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

  console.log("type: ", type);
  console.log("hash: ", hash);
  console.log("session_id: ", session_id);

  // ALL the error are catched by the Error.tsx boundary
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

    const supabaseClient = createClient();

    const { data: sessionData, error: sessionError } = await supabaseClient
      .from("stripe_checkout_sessions")
      .select("id, fulfilled, created_at")
      .eq("session_id:", session_id)
      .single<{ id: string; fulfilled: boolean; created_at: string }>();

    if (sessionError) {
      throw new Error(`Sessions: ${sessionError.message}`);
    }

    if (!sessionData) {
      throw new Error("ID Stripe transaction not found");
    }

    if (!sessionData.fulfilled) {
      // Not fulfiled, need to wait
      throw new Error("Stripe transaction not processed. Need to wait");
    }

    const { data: buysData, error: buysError } = await supabaseClient
      .from("stripe_buys")
      .select("token_id, claimed, tx_hash, created_at")
      .eq("session_id", sessionData.id)
      .returns<
        {
          token_id: string;
          claimed: boolean;
          tx_hash: Hex;
          created_at: string;
        }[]
      >();

    if (buysError) {
      throw new Error(`Buys: ${buysError.message}`);
    }

    if (!buysData || buysData.length === 0) {
      throw new Error("No buys found for this transaction");
    }

    const appUrl = getUrl(headers().get("referer"));

    const response = await fetch(
      `${appUrl}/api/stripe/checkout_sessions?session_id=${session_id}&skip_check=${1}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Stripe checkout session not found");
    }

    const stripeSessionData = (await response.json()) as {
      customer_email: string;
      totalAmount: number;
      currency: string;
    };

    const tokensId = buysData.map((buys_) => buys_.token_id);

    tableData = {
      type,
      stripeId: session_id,
      tokensId,
      totalAmount: stripeSessionData.totalAmount,
      currency: stripeSessionData.currency,
      buyerEmail: stripeSessionData.customer_email,
      txHash: buysData[0].tx_hash,
      createdAt: buysData[0].created_at,
    };
  }
  // No valid trasanction
  else {
    // ALL the errors are catched by the error.tsx boundary
    throw new Error("Invalid transaction");
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
