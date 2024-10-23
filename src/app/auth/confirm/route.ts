import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = createClient();

    const { data: verifiedData, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // Once the user is verfied and we know that is a wallet user type
    // we proceed to add the data to the wallet_users table
    if (
      verifiedData &&
      verifiedData.user &&
      verifiedData.user.user_metadata.type === "wallet"
    ) {
      // For a signup
      if (type === "signup") {
        const { error: insertError } = await supabase
          .from("wallet_users")
          .insert({
            address: verifiedData.user.user_metadata.address,
            user_id: verifiedData.user.id,
            email: verifiedData.user.email,
          });

        if (insertError) {
          // Something happened when adding the wallet user
          console.log("Wallet user insert error: ", insertError);
        }
      }

      if (type === "email_change") {
        const { error: updateError } = await supabase
          .from("wallet_users")
          .update({
            email: verifiedData.user.email,
          })
          .eq("address", verifiedData.user.user_metadata.address);

        if (updateError) {
          // Something happened when updating the wallet user
          console.log("Wallet user update error: ", updateError);
        }
      }
    }

    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
