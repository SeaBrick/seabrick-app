"use server";
import { mintSeabrickTokens } from "@/lib/contracts/transactions";
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
  console.log("Fulfilling Checkout Session " + sessionId);

  // TODO: Make this function safe to run multiple times,
  // even concurrently, with the same session ID

  // TODO: Make sure fulfillment hasn't already been
  // peformed for this Checkout Session

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

    console.log(
      `Minting... ${quantity} NFTs to this user: ${userMetadata?.email}`
    );

    const isMinted = await mintSeabrickTokens(
      "0x304152266BD626c6D718ca03385F4498D933D168",
      quantity ?? 1
    );

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
    await fulfillCheckout(session.id); // Call your fulfillment function
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
