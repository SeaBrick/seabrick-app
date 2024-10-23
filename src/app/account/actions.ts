"use server";

import { createClient } from "@/lib/supabase/server";
import { getUrl } from "@/lib/utils";
import { headers } from "next/headers";

export async function changeAccountDetails(
  currentState: { message: string },
  formData: FormData
) {
  const supabase = createClient();

  // TODO: USe Zod to validate inputs
  const user_type = formData.get("user_type") as "wallet" | "email";
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data: { [key: string]: string } = {
    name,
  };

  if (user?.email?.toLowerCase() !== email.toLowerCase()) {
    // Need to update email
    data["email"] = email;
  }

  // TODO: Change the email on wallet_users table too using the user.id
  if (user_type === "email") {
    // Get this whole url
    const fullUrl = headers().get("referer");
    const redirectUrl = getUrl(fullUrl);

    const { error: errorUpdate } = await supabase.auth.updateUser(
      {
        email: data["email"],
        data,
      },
      {
        emailRedirectTo: redirectUrl,
      }
    );

    if (errorUpdate) {
      return { message: "User details were not updated" };
    }

    return {
      message:
        "User details updated" +
        (data["email"] ? ". Check your email to accept the email change" : ""),
    };
  } else {
    console.log("new ==============");
    // TODO: Change address disabled at the moment
    // const address = formData.get("address") as string;

    // TODO: Maybe ask for a wallet sign with the old wallet
    // Add CHECKERS since after change, if does not have access to the wallet, it will lose the account

    if (user?.user_metadata.email?.toLowerCase() !== email.toLowerCase()) {
      // Need to update email
      data["email"] = email;
    }

    const { error: queryError, data: queryData } = await supabase
      .from("wallet_users")
      .select("metadata")
      .eq("email", user?.user_metadata.email)
      .single();

    if (queryData) {
      const metadata = {
        ...queryData.metadata,
        ...data,
      };

      const { error: updateError, data: updateData } = await supabase
        .from("wallet_users")
        .update({ email, metadata })
        .eq("email", user?.user_metadata.email)
        .single();

      if (updateError) {
        console.log("Something wrong happened: ", updateError);
        return { message: "Detail were not updated" };
      }

      return {
        message: "User details updated",
      };
    }

    console.log("Something wrong happened: ", queryError);
    return { message: "Something wrong happened" };
  }
}
