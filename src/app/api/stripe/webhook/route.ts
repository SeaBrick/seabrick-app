"use server";
import { mintSeabrickTokens } from "@/lib/contracts/transactions";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { isEmpty } from "lodash";
import {
  addCheckoutSession,
  getCheckoutSession,
  stripe,
  updateSessionFulfillment,
} from "@/app/api/stripe";
import { type Stripe } from "stripe";
import { FulfillCheckoutResp } from "@/lib/interfaces/api";

const endpointSecret = process.env.STRIPE_WEBHOOK_FULFILLMENT_SECRET ?? "";
if (!endpointSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_FULFILLMENT_SECRET value");
}

async function fulfillCheckout(
  sessionId: string
): Promise<FulfillCheckoutResp> {
  // Create a supabase client with service role
  const supabaseClient = createClient(true);

  // Retrieve the Checkout Session from the API with line_items expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  // We already know it will be a `line_items` with just one item (Seabrick NFT (or NFTs)).
  // So we get the `quantity` bought directly
  const quantity = checkoutSession.line_items?.data[0].quantity;

  // User metadata from the User that made the Buy
  const userMetadata = checkoutSession.metadata;

  if (userMetadata == null || isEmpty(userMetadata) || !userMetadata.user_id) {
    console.error("No user metadata found for this session: ", sessionId);
    return {
      isMinted: false,
      message: "No user metadata found for this session",
    };
  }

  if (!quantity) {
    console.error("No Seabrick quantity defined for this session: ", sessionId);
    return {
      isMinted: false,
      message: "No Seabrick quantity defined for this session",
    };
  }

  // Check if the session has already been fulfilled
  const getSessionResp = await getCheckoutSession(supabaseClient, sessionId);

  // Separated assignements
  const checkError = getSessionResp.error;
  let sessionData = getSessionResp.data;

  // `PGRST116` is `The result contains 0 rows` error. Since the table have a unique constraint at session_id,
  // this means that the entry is not created yet
  // If we get that error, means that the session is not found (not fulfilled)
  if (checkError && checkError.code != "PGRST116") {
    const isAdded = await addCheckoutSession(
      supabaseClient,
      sessionId,
      userMetadata.user_id,
      false
    );

    if (isAdded) {
      const newGetSession = await getCheckoutSession(supabaseClient, sessionId);
      sessionData = newGetSession.data;
    }
  }

  if (!sessionData) {
    return {
      isMinted: false,
      message: `Session not saved on database. ID: ${sessionId}`,
    };
  }

  // If the session has already been fulfilled, return early
  if (sessionData.fulfilled) {
    // We return isMinted as true since it's already fulfilled, which means
    // that the NFTs related to this stripe session were already minted
    console.info("Session already fulfilled. ID: ", sessionId);
    return { isMinted: true };
  }

  // Check the Checkout Session's payment_status property
  // to determine if fulfillment should be peformed
  if (checkoutSession.payment_status !== "unpaid") {
    // We mark the session as fulfilled before sending any transaction
    const statusUpdated = await updateSessionFulfillment(
      supabaseClient,
      sessionId,
      true
    );

    // If we get an error on this, we do not continue.
    // This way we avoid minting multiple times or any security issue
    if (!statusUpdated) {
      return {
        isMinted: false,
        message: `Cannot mark the session as fulfilled: ID: ${sessionId}`,
      };
    }

    // Mint tokens to the our "minter" address, so we can identify them
    const mintResp = await mintSeabrickTokens(quantity);

    if (mintResp.isMinted === true) {
      // Everything went good, we return that was minted
      // TODO: Perform fulfillment of the line items, like mintint the total amount and saving the ids
      // to the DB and the vault app address (NOT for the vault for the collected)

      const { error: insertError } = await supabaseClient
        .from("stripe_buys")
        .insert({
          tx_hash: mintResp.txHash,
          tokens_id: mintResp.ids,
          user_id: userMetadata.user_id,
          session_id: sessionData.id,
          amount: quantity,
          claimed: false,
        });

      if (insertError) {
        console.error(
          "Stripe buy information was not added to the Database. Session ID: ",
          sessionId,
          "\n",
          insertError
        );
      }

      return { isMinted: true };
    }

    // If not minted
    else {
      // We change the status on supabase since tokens were not minted,
      // which means that the session was not fulfilled
      const statusUpdated = await updateSessionFulfillment(
        supabaseClient,
        sessionId,
        false
      );

      if (!statusUpdated) {
        // Something bad happened, must be checked
        console.error(
          "Checkout session not minted and not set status as false again. Session ID: ",
          sessionId
        );
      }

      return {
        isMinted: false,
        message: "Tokens were not minted for this session",
      };
    }
  }

  return {
    isMinted: false,
    message: "The payment_status of this session is unpaid",
  };
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
    // Define the error message
    let message = "";

    // If the error is an instace of Error class, we get the message from there
    if (err instanceof Error) {
      message = err.message;
    } else {
      // Otherwise is an Unkwown error. We log it, but do not return it
      console.error("error: ", err);
      message = "Unkwown error";
    }
    console.error(`Webhook signature verification failed.`, message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    // We get the session object
    const session = event.data.object;

    // Run to fulfill the checkout
    const isFulfilled = await fulfillCheckout(session.id);

    // If the session was not fulfilled, then we return an error with the message
    // Which will case that this session will be tried after a while
    if (isFulfilled.isMinted === false) {
      return NextResponse.json(
        { error: `Webhook Error: ${isFulfilled.message}` },
        { status: 400 }
      );
    }
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
