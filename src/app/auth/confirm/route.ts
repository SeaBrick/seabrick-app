import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

    // If the verifyOtp failed, tokens is expired or something else happened.
    // So, it's not allowed to do something
    if (error) {
      console.log("error: ", verifiedData);
      redirect("/");
    }

    if (type === "recovery") {
      // TODO: Add a cookie that should be visible at the reset page.
      // If the cookie is present there, then you can access to recovery your password
      // Otherwsie, it will be not allowed to go thre
      // This because the path is accesible for the current autheticated user
      // We want a flow to be like, to recover the password, use this.
      // FOr a normal password change, use the account details
      redirect("/auth/reset");
    }

    // Once the user is verfied and we know that is a wallet user type
    // we proceed to add the data to the wallet_users table
    if (
      verifiedData &&
      verifiedData.user &&
      verifiedData.user.user_metadata.type === "wallet"
    ) {
      // For a signup
      if (type === "signup") {
        //
      }

      if (type === "email_change") {
        const { error: updateError } = await supabase
          .from("wallet_users")
          .update({
            email: verifiedData.user.email,
          })
          .eq("user_id", verifiedData.user.id);

        if (updateError) {
          // Something happened when updating the wallet user
          console.log("Wallet user update error: ", updateError);
        }
      }
    }

    if (!error) {
      // redirect user to specified redirect URL or root of app
      revalidatePath("/", "layout");
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
