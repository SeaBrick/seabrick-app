import { createClient } from "@/lib/supabase/server";
import { getUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { stripe } from "@/app/api/stripe";

export async function POST(request: NextRequest) {
  // Get the current redirect url
  const fullUrl = request.headers.get("referer");
  const redirectUrl = getUrl(fullUrl);

  // Get the supbase client
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not user logged, redirect to login
  if (!user) {
    redirect("/login");
  }

  // If the user does not have an email, redirect to error
  if (!user.email) {
    console.error("ERROR: User does not have an email. It is a total error");
    redirect("/error");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: {
        ...user.user_metadata,
        email: user.email,
        user_id: user.id,
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
      return_url: redirectUrl + "return?session_id={CHECKOUT_SESSION_ID}",
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe POST: ", error);
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
    console.log("session");
    console.log(session);

    // The checkout session is complete. Payment processing may still be in progress
    if (session.status == "complete") {
      const supabaseClient = createClient();

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
    }

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
