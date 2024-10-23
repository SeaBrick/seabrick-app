"use server";

import { createClient } from "@/lib/supabase/server";
import { getUrl } from "@/lib/utils";
import { UserAttributes } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function changeAccountDetails(
  currentState: { message: string },
  formData: FormData
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Maybe this is useless since the middleware already do this
  if (!user) {
    return { message: "not logged..." };
  }

  // TODO: USe Zod to validate inputs
  const user_type = formData.get("user_type") as "wallet" | "email";
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // User data to be updated
  const userData: UserAttributes = {};

  // Only update the email if it's different (case no-sensitive)
  if (user.email?.toLowerCase() !== email.toLowerCase()) {
    userData.email = email;
  }

  // Only update name if it's different (case sensitive)
  if (user.user_metadata.name !== name) {
    userData.data = {
      ...userData.data,
      name,
    };
  }

  // Get the whole url
  const fullUrl = headers().get("referer");
  const redirectUrl = getUrl(fullUrl);

  const { error: errorUpdate } = await supabase.auth.updateUser(userData, {
    emailRedirectTo: redirectUrl,
  });

  if (errorUpdate) {
    if (errorUpdate.code === "email_exists") {
      return { message: errorUpdate.message };
    } else {
      console.log("Error when updating user details: ", errorUpdate);
    }
    return { message: "User details were not updated" };
  }

  // TODO: Change the email on wallet_users table too using the user.id

  if (user_type === "wallet") {
    // TODO: Checkers like we are not "updating" the same wallet
    // TODO: Change address disabled at the moment
    // TODO: USe Zod to validate inputs
    // const address = formData.get("address") as string;
    // TODO: Maybe ask for a wallet sign with the old wallet
    // Add CHECKERS since after change, if does not have access to the wallet, it will lose the account
    // Verify the new signature, etc etc
    // const { error: queryError, data: queryData } = await supabase
    //   .from("wallet_users")
    //   .select("metadata")
    //   .eq("email", user.email)
    //   .single();
  }

  return {
    message: userData.email
      ? "Email updated. Check your new email inbox"
      : "User details updated",
  };
}
