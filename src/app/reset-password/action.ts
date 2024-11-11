"use server";

import { createClient } from "@/lib/supabase/server";
import { UserAuthSchema } from "@/lib/zod";

// TODO: Check if it's a wallet user

export async function requestResetPassword(formData: FormData) {
  // Create supabase client
  const supabaseClient = createClient();

  // Validate the formdata
  const {
    data: validatedData,
    success: validationSuccess,
    error: validationError,
  } = UserAuthSchema.omit({ password: true }).safeParse({
    email: formData.get("email"),
  });

  if (!validationSuccess) {
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }

  const { email } = validatedData;

  const { data: dataUser, error: errorUser } = await createClient(true)
    .rpc("get_user_id_by_email", {
      email: email,
    })
    .returns()
    .single<{ id: string }>();

  // No user found
  if (errorUser) {
    if (errorUser.code == "PGRST116") {
      return { error: "User with this email not found" };
    }

    return { error: errorUser.message };
  }

  const { data: userData, error: userError } = await createClient(
    true
  ).auth.admin.getUserById(dataUser.id);

  if (userError) {
    return { error: "User not found" };
  }

  const {
    user: { user_metadata },
  } = userData;

  // If user type is an user wallet, the user is trying "recover" the password
  // of an account created by a Web3Wallet
  if (user_metadata.type == "wallet") {
    return {
      error:
        "This account was created with a Web3 wallet. Please use your wallet to log in",
    };
  }

  const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: "https://example.com/update-password",
    }
  );

  if (resetError) {
    console.error("An error occur when a request the password reset");
    return { error: resetError.message };
  }

  // Reset request made
}
