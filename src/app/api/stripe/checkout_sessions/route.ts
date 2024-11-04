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
    console.error("User does not have an email. It is a total error");
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
    const supabaseClient = createClient();

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // If not user logged, redirect to login
    if (!user) {
      redirect("/login");
    }

    // Get the URL from request
    const url = new URL(request.url);

    // Search the session_id from the query parameters
    const sessionId = url.searchParams.get("session_id");

    // If no session ID, redirect to an error page
    if (!sessionId) {
      console.error("No stripe session ID");
      redirect("/error");
    }

    // Get the session object from the sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // The checkout session is complete. Payment processing may still be in progress
    if (session.status == "complete") {
      // Get the session
      const { error: checkError } = await supabaseClient
        .from("stripe_checkout_sessions")
        .select("fulfilled")
        .eq("session_id", sessionId)
        .single();

      // `PGRST116` is `The result contains 0 rows` error. Since the table have a unique constraint at session_id,
      // this means that the entry is not created yet
      // If created, then do nothing.
      if (checkError && checkError.code == "PGRST116") {
        const { error: insertError } = await supabaseClient
          .from("stripe_checkout_sessions")
          .insert({
            session_id: sessionId,
            user_id: user.id,
            fulfilled: false,
          });

        if (insertError) {
          console.error("It cannot save the stripe session: \n", insertError);
          redirect("/error");
        }
      }
    }

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email || "Not found",
    });
  } catch (error) {
    console.error("Stripe GET: ", error);
    return NextResponse.json(
      { error: "Failed to get the session payment" },
      { status: 500 }
    );
  }
}
