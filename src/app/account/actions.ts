"use server";

import { createClient } from "@/lib/supabase/server";
import { getUrl } from "@/lib/utils";
import { UserAccountPersonalInfoSchema } from "@/lib/zod";
import { UserAttributes } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function changeAccountDetails(formData: FormData) {
  const supabase = createClient();

  const {
    data: validationData,
    success: validationSuccess,
    error: validationError,
  } = UserAccountPersonalInfoSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    user_type: formData.get("user_type"),
  });

  if (!validationSuccess) {
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Maybe this is useless since the middleware already do this
  if (!user) {
    return { error: "Not logged" };
  }

  const user_type = validationData.user_type;
  const name = validationData.name;
  const email = validationData.email;

  if (user.user_metadata.type != user_type) {
    // This error should not happen if the values are correclty passed
    return { error: "Bad request - Mismatch user_type" };
  }

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
      return { error: errorUpdate.message };
    } else {
      console.log("Error when updating user details: ", errorUpdate);
    }
    return { error: "User details were not updated" };
  }

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
