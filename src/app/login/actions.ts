"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  SignInWithPasswordCredentials,
  SupabaseClient,
} from "@supabase/supabase-js";
import {
  deleteNonceSession,
  getNonceSession,
  getUniquePassword,
  verifySignature,
} from "@/lib/utils/session";
import { UserAuthSchema, userLoginWalletSchema } from "@/lib/zod";

async function loginInternal(
  supabaseClient: SupabaseClient<never, "public", never>,
  data: SignInWithPasswordCredentials
) {
  const { error } = await supabaseClient.auth.signInWithPassword(data);

  if (error) {
    if (error.code != "invalid_credentials") {
      // Print to debug in other scenarios
      console.error("Login error: ", error);
      return { error: "Internal server error" };
    }

    return { error: "Invalid credentials" };
  }
}

export async function login(formData: FormData) {
  const supabase = createClient();

  // Validate the incoming data
  const {
    data: validationData,
    success: validationSuccess,
    error: validationError,
  } = UserAuthSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationSuccess) {
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }

  const loginResp = await loginInternal(supabase, {
    email: validationData.email,
    password: validationData.password,
  });

  // If we got response from loginInternal, an error happened
  if (loginResp) {
    return loginResp;
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function loginWithWallet(formData: FormData) {
  // Create supabase client
  const supabase = createClient();

  // Validate the incoming data
  const {
    data: validationData,
    success: validationSuccess,
    error: validationError,
  } = userLoginWalletSchema.safeParse({
    address: formData.get("address"),
    signature: formData.get("signature"),
  });

  if (!validationSuccess) {
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }

  // Deconstruct the values for better readability
  const { address, signature } = validationData;

  // Get the nonce session
  const nonceSession = await getNonceSession();
  if (!nonceSession) {
    return { error: "Nonce session not found" };
  }

  // Validating signature
  const isValidSignature = await verifySignature(
    address,
    nonceSession,
    signature
  );

  // Return error message if not valid signature
  if (!isValidSignature) {
    return { error: "Not valid signature" };
  }

  const { data: queryData, error: queryError } = await supabase
    .from("wallet_users")
    .select("user_id")
    .eq("address", address.toLowerCase())
    .single<{ user_id: string }>();

  if (queryError || !queryData) {
    console.log("Query error at sign in wallet: ", queryError);
    return { error: "User not found" };
  }

  const { data: userData, error: userError } = await createClient(
    true
  ).auth.admin.getUserById(queryData.user_id);

  if (userError) {
    console.log("Query error at sign in wallet: ", queryError);
    return { error: "User not found" };
  }

  const {
    user: { email, user_metadata },
  } = userData;

  // If user type is not a user wallet, the user is trying to log with wallet
  // instead of his email/password
  if (user_metadata.type !== "wallet") {
    return { error: "You should login with your email" };
  }

  if (!email) {
    console.log(
      "Big error, the user user do not have an email. ID: ",
      queryData.user_id
    );
    return { error: "Internal server error" };
  }

  const loginResp = await loginInternal(supabase, {
    email: email,
    password: await getUniquePassword(address),
  });

  // If we got response from loginInternal, an error happened
  if (loginResp) {
    return loginResp;
  }

  deleteNonceSession();
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}
