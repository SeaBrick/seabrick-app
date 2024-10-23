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
    // TODO: Perform fulfillment of the line items
    // TODO: Record/save fulfillment status for this
    // Checkout Session
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing so we can access the raw body
  },
};
export async function POST(req: NextRequest) {
  // Retrieve the raw body
  console.log("ENTER POST");

  // const buf = req.body;
  const buf = await req.text();

  console.log("buf: ", buf);
  // const sig = req.headers.get("stripe-signature");
  const sig = req.headers.get("stripe-signature");
  // const sig = req.headers["stripe-signature"];
  console.log("sig: ", sig);

  let event;

  if (!sig) {
    return NextResponse.json(
      { error: "Failed to create the session payment - No signature" },
      { status: 500 }
    );
  }
  if (!buf) {
    return NextResponse.json(
      { error: "Failed to create the session payment - No buf" },
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

// // Utility function to read the body as a Buffer
// const buffer = (req: NextRequest) => {
//   return new Promise<Buffer>((resolve, reject) => {
//     const chunks: Buffer[] = [];

//     req.on("data", (chunk: Buffer) => {
//       chunks.push(chunk);
//     });

//     req.on("end", () => {
//       resolve(Buffer.concat(chunks));
//     });

//     req.on("error", reject);
//   });
// };
