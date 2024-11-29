"use server";

import { Resend } from "resend";
import * as ejs from "ejs";
import { Hash } from "viem";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";

const resend_key = process.env.RESEND_KEY;

if (!resend_key) {
  throw new Error("Missing RESEND_KEY value");
}

export async function sendReceipt(
  email: string,
  tokenIds: string[],
  txHash: Hash,
  date: Date,
  supabaseClient?: SupabaseClient<never, "public", never>
): Promise<boolean> {
  if (!resend_key) {
    return false;
  }

  if (!supabaseClient) {
    supabaseClient = createClient();
  }

  const { error, data } = await supabaseClient
    .from("email_templates")
    .select("raw_html")
    .eq("id", "receipt")
    .single<{ raw_html: string }>();

  if (error) {
    console.error("Failed to retrieve the email receipt template");
    console.error(error);
    return false;
  }

  // Raw data with the variable slots
  const raw = data.raw_html;

  // Html string with the raw html and variables rendered
  const html = ejs.render(raw, {
    email,
    date: date.toLocaleDateString(),
    tokenIds: tokenIds.join(", "),
    hash: txHash,
    logoUrl: "app.seabrick.com/seabrick.svg",
  });

  try {
    // Create resend entity
    const resend = new Resend(resend_key);

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Seabrick <receipt@seabrick.com>",
      to: [email],
      subject: "Thanks for the Buy! Here is your receipt",
      html: html,
    });

    if (error) {
      console.error("Error sending the email");
      console.error(error);
      return false;
    }

    if (data) {
      return true;
    }
  } catch (e) {
    console.error("Error sending the email");
    console.error(e);
    return false;
  }

  return false;
}
