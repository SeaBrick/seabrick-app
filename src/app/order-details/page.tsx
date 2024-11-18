"use client";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import DetailsTable, { type DetailsTableProps } from "./DetailsTable";
import { type Hex, isHash } from "viem";
import { getBuysByTransaction } from "@/lib/subgraph";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

async function getBuysCrypto(txHash: Hex): Promise<DetailsTableProps> {
  const resp = await getBuysByTransaction(txHash);

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

  return {
    type: "crypto",
    txHash,
    paymentToken: resp[0].paymentToken,
    totalAmountPaid,
    tokensId,
    blockNumber: resp[0].blockNumber,
    blockTimestamp: resp[0].blockTimestamp,
    buysData: resp,
  };
}

async function getBuysStripe(stripeId: string): Promise<DetailsTableProps> {
  const supabaseClient = createClient();

  const { data: sessionData, error: sessionError } = await supabaseClient
    .from("stripe_checkout_sessions")
    .select("id, fulfilled, created_at")
    .eq("session_id", stripeId)
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

  const response = await fetch(
    `/api/stripe/checkout_sessions?session_id=${stripeId}&skip_check=${1}`,
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

  return {
    type: "stripe",
    stripeId: stripeId,
    tokensId,
    totalAmount: stripeSessionData.totalAmount,
    currency: stripeSessionData.currency,
    buyerEmail: stripeSessionData.customer_email,
    txHash: buysData[0].tx_hash,
    createdAt: buysData[0].created_at,
  };
}

// TODO: Add loading effect
const OrderDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const hash = searchParams.get("hash");
  const session_id = searchParams.get("session_id");

  const [tableDetails, setTableDetails] = useState<DetailsTableProps>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(undefined);

      try {
        // ALL the error are catched by the Error.tsx boundary
        if (type === "crypto") {
          if (!hash || !isHash(hash)) {
            // throw new Error("Invalid hash for Crypto transaction");
            console.log("Invalid hash for Crypto transaction");
            setTableDetails(undefined);
            return;
          }
          // Perform for crypto
          const data = await getBuysCrypto(hash);
          setTableDetails(data);
          console.log("aja buy scripto");
        }
        //
        else if (type === "stripe") {
          if (!session_id) {
            // throw new Error("Invalid ID Stripe transaction");
            console.log("Invalid ID Stripe transaction");
            setTableDetails(undefined);
            return;
          }

          // Perform for stripte
          const data = await getBuysStripe(session_id);
          setTableDetails(data);
          console.log("aja buy stripe");
        }
        // No valid trasanction
        else {
          // throw new Error("Invalid transaction");
          console.log("Invalid transaction");
          setTableDetails(undefined);
          return;
        }
      } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [hash, session_id, type]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[978px] w-[80%] flex flex-col items-center mx-auto mt-[30px] relative">
        <h2 className="text-black text-3xl font-normal font-['Noto Sans'] text-center mb-8">
          Order Details
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : error !== undefined || tableDetails === undefined ? (
          <div className="text-center p-24 bg-white rounded-lg shadow-xl flex flex-col gap-y-5">
            <h1 className="text-5xl font-bold text-seabrick-blue">Error</h1>
            <div>
              <p className="text-gray-500">Oops! Something went wrong!</p>
              {error && <p className="text-gray-500">{error}</p>}
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
        ) : (
          <>
            <DetailsTable {...tableDetails} />
            <Link
              href="/dashboard"
              prefetch={true}
              className="flex items-center gap-2 px-4 py-2 rounded mt-4 text-white bg-seabrick-blue hover:bg-seabrick-blue/80 self-end"
            >
              <span className="font-['Montserrat'] text-sm">Go to Home</span>
              <HomeIcon className="size-6" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
