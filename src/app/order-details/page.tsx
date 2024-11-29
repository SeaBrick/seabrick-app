"use client";
import Link from "next/link";
import { HomeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import DetailsTable, { type DetailsTableProps } from "./DetailsTable";
import { type Hex, isHash } from "viem";
import { getBuysByTransaction } from "@/lib/subgraph";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBricks from "@/components/spinners/LoadingBricks";
import ReloadButton from "@/components/buttons/ReloadButton";

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
    throw new Error("Stripe buy transaction not found");
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

const OrderDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const hash = searchParams.get("hash");
  const session_id = searchParams.get("session_id");

  const [tableDetails, setTableDetails] = useState<DetailsTableProps>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  // Retry logic with exponential backoff
  async function fetchWithRetries(
    fetchFn: () => Promise<DetailsTableProps>,
    maxRetries = 3,
    delay = 1000
  ) {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        const data = await fetchFn();
        return data; // If successful, return data
      } catch (err) {
        attempts++;
        if (attempts >= maxRetries) {
          throw err; // If max retries are reached, throw error
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(undefined);

      try {
        // Determine which function to call based on type
        let fetchData: () => Promise<DetailsTableProps>;

        if (type === "crypto") {
          if (!hash || !isHash(hash)) {
            console.log("Invalid hash for Crypto transaction");
            setTableDetails(undefined);
            return;
          }
          fetchData = () => getBuysCrypto(hash);
        } else if (type === "stripe") {
          if (!session_id) {
            console.log("Invalid ID Stripe transaction");
            setTableDetails(undefined);
            return;
          }
          fetchData = () => getBuysStripe(session_id);
        } else {
          console.log("Invalid transaction");
          setTableDetails(undefined);
          return;
        }

        // Fetch data with retries
        const data = await fetchWithRetries(fetchData, 3, 1000); // 3 retries with 1 second gap
        setTableDetails(data);
      } catch (err) {
        let errorMessage = "Unknown error";

        if (err instanceof Error) {
          errorMessage = err.message;
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
          <div>
            <LoadingBricks />
            <p>Loading...</p>
          </div>
        ) : error !== undefined || tableDetails === undefined ? (
          <div className="flex items-center justify-center bg-gray-100">
            <div className="text-center p-24 bg-white rounded-lg shadow-xl flex flex-col gap-y-5">
              <h1 className="text-5xl font-bold text-seabrick-blue">Error</h1>
              <div className="flex flex-col gap-y-4">
                <p className="text-gray-500">Oops! Something went wrong!</p>
                {error && <p className="text-gray-500">{error}</p>}
                <p className="text-gray-500">You can try reloading the page</p>
              </div>
              <div className="flex gap-x-4 justify-center">
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
        ) : (
          <>
            <DetailsTable {...tableDetails} />
            <div className="flex justify-end gap-4">
              <Link
                href="/dashboard"
                prefetch={true}
                className="flex items-center gap-2 px-4 py-2 rounded mt-4 text-white bg-seabrick-blue hover:bg-seabrick-blue/80 self-end"
              >
                <HomeIcon className="size-5" />
                <span className="font-['Montserrat'] text-sm">Go to Home</span>
              </Link>
              <Link
                href="/buy"
                prefetch={true}
                className="flex items-center gap-2 px-4 py-2 rounded mt-4 text-white bg-seabrick-green hover:bg-seabrick-green/80 self-end"
              >
                <ShoppingCartIcon className="size-5" />
                <span className="font-['Montserrat'] text-sm">Buy more</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
