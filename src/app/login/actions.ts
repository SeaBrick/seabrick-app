"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Address, Hex, isHex } from "viem";
import type {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
  SupabaseClient,
} from "@supabase/supabase-js";
import { headers } from "next/headers";
import { checkAddress, getUrl } from "@/lib/utils";
import {
  deleteNonceSession,
  getNonceSession,
  getUniquePassword,
  verifySignature,
} from "@/lib/utils/session";
import { userLoginSchema, userLoginWalletSchema } from "@/lib/zod";

async function loginInternal(
  supabaseClient: SupabaseClient<any, "public", any>,
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
  } = userLoginSchema.safeParse({
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

  revalidatePath("/", "layout");
  redirect("/");
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
    .select("email")
    .eq("address", address.toLowerCase())
    .single<{ email: string }>();

  if (queryError || !queryData) {
    console.log("Query error at sign in wallet: ", queryError);
    return { error: "User not found" };
  }

  const loginResp = await loginInternal(supabase, {
    email: queryData.email,
    password: await getUniquePassword(address),
  });

  // If we got response from loginInternal, an error happened
  if (loginResp) {
    return loginResp;
  }

  deleteNonceSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Get this whole url
  const fullUrl = headers().get("referer");
  const redirectUrl = getUrl(fullUrl);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: USe Zod to validate inputs
  const data: SignUpWithPasswordCredentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      // captchaToken
      data: {
        type: "email",
      },
      emailRedirectTo: redirectUrl,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log("Signup error: ", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUpWithWallet(
  currentState: { message: string },
  formData: FormData
) {
  // Create supabase client
  const supabase = createClient();

  // type-casting here for convenience
  // TODO: USe Zod to validate inputs
  const address = formData.get("address")?.toString() as string;
  const signature = formData.get("signature")?.toString() as string;
  const email = formData.get("email")?.toString() as string;
  // // TODO: Find usage to this value
  // const _emailPromotions = formData
  //   .get("email-promotions")
  //   ?.toString() as string;

  const nonceSession = await getNonceSession();

  if (!nonceSession) {
    return { message: "Nonce session not found" };
  }

  // Validating signature
  const isValidSignature = await verifySignature(
    address! as Address,
    nonceSession,
    signature! as Hex
  );

  // Return error message if not valid signature
  if (!isValidSignature) {
    return { message: "Not valid signature" };
  }

  // Get the whole url to generate the redirect url
  const fullUrl = headers().get("referer");
  const redirectUrl = getUrl(fullUrl);

  // type-casting here for convenience
  // TODO: USe Zod to validate inputs
  const data: SignUpWithPasswordCredentials = {
    email,
    password: await getUniquePassword(address as Address),
    options: {
      // captchaToken
      data: {
        type: "wallet",
        address: address,
      },
      emailRedirectTo: redirectUrl,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log("Signup error: ", error);
    redirect("/error");
  }

  deleteNonceSession();
  revalidatePath("/", "layout");

  return { message: `Email sent to your linked email. Ple1ase confirm it` };
}
