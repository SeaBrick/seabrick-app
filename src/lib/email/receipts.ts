"use server";

import { Resend } from "resend";

const resend_key = process.env.RESEND_KEY;

if (!resend_key) {
  throw new Error("Missing RESEND_KEY value");
}

async function sendReceipt(email: string): Promise<boolean> {
  if (!resend_key) {
    return false;
  }

  const resend = new Resend(resend_key);

  try {
    const { data, error } = await resend.emails.send({
      from: "Seabrick <onboarding@resend.dev>",
      to: [email],
      // TODO: Change the subject
      subject: "Hello man! Works! This is your receipt",
      // TODO: Use the email template from the DB
      html: "<strong>It works! You got your receipt!</strong>",
    });

    if (error) {
      console.error("Error sending the email");
      console.error(error);
      return false;
    }

    if (data) {
      console.log("email sent: ", data);
      return true;
    }
  } catch (e) {
    console.error("Error sending the email");
    console.error(e);
    return false;
  }

  return false;
}
