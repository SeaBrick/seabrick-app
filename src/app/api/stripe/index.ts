import { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// TODO: Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
if (!stripe_secret_key) {
  throw new Error("Missing STRIPE_SECRET_KEY value");
}

export const stripe = new Stripe(stripe_secret_key);

export async function getCheckoutSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: SupabaseClient<any, "public", any>,
  sessionId: string
) {
  console.log(`--------------- Obtaining the session DB of: ${sessionId}`);
  return await supabaseClient
    .from("stripe_checkout_sessions")
    .select("id, session_id, fulfilled, user_id")
    .eq("session_id", sessionId)
    .single<{
      id: string;
      session_id: string;
      user_id: string;
      fulfilled: boolean;
    }>();
}

export async function updateSessionFulfillment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: SupabaseClient<any, "public", any>,
  sessionId: string,
  status: boolean
) {
  console.log(`========== Changing the status (${status}) of: ${sessionId}`);
  const { error: updateError } = await supabaseClient
    .from("stripe_checkout_sessions")
    .update({
      fulfilled: status,
    })
    .eq("session_id", sessionId);

  if (updateError) {
    console.error(
      "Update session checkout fulfilled status failed. ID: ",
      sessionId
    );
    return false;
  }

  return true;
}
