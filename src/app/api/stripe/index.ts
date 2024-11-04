import Stripe from "stripe";

const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
if (!stripe_secret_key) {
  throw new Error("Missing STRIPE_SECRET_KEY value");
}

export const stripe = new Stripe(stripe_secret_key);
