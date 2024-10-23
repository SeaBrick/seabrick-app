import { createClient } from "@/lib/supabase/server";
import { getUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
if (!stripe_secret_key) {
  throw new Error("Missing STRIPE_SECRET_KEY value");
}

const stripe = new Stripe(stripe_secret_key);

export async function POST(request: NextRequest) {
  const fullUrl = request.headers.get("referer");
  const redirectUrl = getUrl(fullUrl);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userType = user?.user_metadata?.type;

  // TODO: Support both type of accounts
  if (userType === "email") {
    // If it's email, we should use the email at the top of user (user.email)
  } else {
    // It's not email, then it's wallet. We sent it to the user?.user_metadata?.email
    throw new Error("Not support for wallet accounts yet");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: {
        ...user?.user_metadata,
        email: user?.email || "",
      },
      line_items: [
        {
          price: "price_1Q7Kzq2KHsUnmKagnzvNoHwL",
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
          },
        },
      ],
      mode: "payment",
      consent_collection: {
        terms_of_service: "required",
        promotions: "auto",
      },
      return_url: `${redirectUrl}return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.log("error in stripe POST: ", error);
    return NextResponse.json(
      { error: "Failed to create the session payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Get the session_id from the query parameters
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      throw new Error("No stripe session ID");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email || "Not found",
    });
  } catch (error) {
    console.log("error in stripe GET: ", error);
    return NextResponse.json(
      { error: "Failed to get the session payment" },
      { status: 500 }
    );
  }
}
