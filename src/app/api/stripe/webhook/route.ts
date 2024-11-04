"use server";
import { mintSeabrickTokens } from "@/lib/contracts/transactions";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

// TODO: Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
if (!stripe_secret_key) {
  throw new Error("Missing STRIPE_SECRET_KEY value");
}

const stripe = new Stripe(stripe_secret_key);
const endpointSecret = "whsec_xuhkLFhktNSMVBm5rN3nFR3lOZWFHQN7";

async function fulfillCheckout(sessionId: string) {
  const supabaseClient = createClient();

  // TODO: Make this function safe to run multiple times,
  // even concurrently, with the same session ID

  // TODO: Make sure fulfillment hasn't already been
  // peformed for this Checkout Session

  // Check if the session has already been fulfilled
  const { data: sessionData, error: checkError } = await supabaseClient
    .from("stripe_checkout_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  // `PGRST116` is `The result contains 0 rows` error (since the table have a unique constraint at session_id)
  // If we get that error, means that the session is not found (not fulfilled)
  if (checkError && checkError.code != "PGRST116") {
    // TODO: Not throw, just return something
    console.error("Error checking session status:", checkError.message);
    throw new Error("Failed to check session status");
  }

  // If the session has already been fulfilled, return early
  if (sessionData?.fulfilled) {
    // TODO: Return something
    console.log("Session already fulfilled");
    return;
  }

  // Retrieve the Checkout Session from the API with line_items expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  // Check the Checkout Session's payment_status property
  // to determine if fulfillment should be peformed
  if (checkoutSession.payment_status !== "unpaid") {
    // We already know it will be a `line_items` with just one item.
    // So we get the `quantity` bought directly
    const quantity = checkoutSession.line_items?.data[0].quantity;

    // User metadata from supabase
    // TODO: Use this data to mint or get data to mint and assign the nfts
    const userMetadata = checkoutSession.metadata;

    // console.log("userMetadata: ", userMetadata);

    console.log(
      `Minting... ${quantity} NFTs to this user: ${userMetadata?.email}`
    );

    const isMinted = await mintSeabrickTokens(
      "0x304152266BD626c6D718ca03385F4498D933D168",
      quantity ?? 1
    );

    if (isMinted) {
      // Mark the session as fulfilled in Supabase
      const { error: updateError } = await supabaseClient
        .from("stripe_checkout_sessions")
        .upsert({
          session_id: sessionId,
          fulfilled: true,
          user_id: "",
        });

      if (updateError) {
        console.error(
          "Error marking session as fulfilled:",
          updateError.message
        );
        throw new Error("Failed to mark session as fulfilled");
      }

      console.log("Session fulfillment completed.");
    } else {
      // TODO: Not throw, just return something
      throw new Error("Minting failed.");
    }

    // TODO: Perform fulfillment of the line items, like mintint the total amount and saving the ids
    // to the DB and the vault app address (NOT for the vault for the collected)
    // TODO: Record/save fulfillment status for this
    // Checkout Session
  }
}

export async function POST(req: NextRequest) {
  const buf = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event | undefined;

  if (!sig) {
    return NextResponse.json(
      { error: "Failed to create the session payment - No signature" },
      { status: 500 }
    );
  }

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    let message = "";
    if (err instanceof Error) {
      message = err.message;
    } else {
      console.log("error: ", err);
      message = "Unkwown error";
    }
    console.error(`Webhook signature verification failed.`, message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event (e.g., fulfilled Checkout session)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const isFulfilled = await fulfillCheckout(session.id);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
