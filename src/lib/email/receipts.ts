"use server";

import { Resend } from "resend";
import * as ejs from "ejs";
import { Hash } from "viem";

const resend_key = process.env.RESEND_KEY;

if (!resend_key) {
  throw new Error("Missing RESEND_KEY value");
}

export async function sendReceipt(
  email: string,
  tokenIds: string[],
  txHash: Hash,
  date: Date
): Promise<boolean> {
  if (!resend_key) {
    return false;
  }

  const resend = new Resend(resend_key);

  // TODO: Use template from DB
  const raw = `<div>
  <p>User: <%=email%></p>
  <p>
  Token IDs: <span><%=tokenIds%></span>
  </p>
  <p>
  Purchate at: <span><%=date%></span>
  </p>
  <p>
  Verified at tx hash: <span><%=hash%></span>
  </p>
  </div>`;

  const html = ejs.render(raw, {
    email,
    date: date.toLocaleDateString(),
    tokenIds: tokenIds.join(", "),
    hash: txHash,
    logoUrl: "app.seabrick.com/seabrick.svg",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "Seabrick <receipt@seabrick.com>",
      to: [email],
      subject: "Thanks for the Buy! Here is your receipt",
      // TODO: Use the email template from the DB
      html: html,
      // html: "<strong>It works! You got your receipt!</strong>",
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
