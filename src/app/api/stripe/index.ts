import Stripe from "stripe";


// TODO: Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
if (!stripe_secret_key) {
  throw new Error("Missing STRIPE_SECRET_KEY value");
}

export const stripe = new Stripe(stripe_secret_key);
