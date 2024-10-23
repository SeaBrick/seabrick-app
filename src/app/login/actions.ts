"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Address, Hex } from "viem";
import type {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";
import { headers } from "next/headers";
import { getUrl } from "@/lib/utils";
import {
  getSession,
  getUniquePassword,
  verifySignature,
} from "@/lib/utils/session";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: USe Zod to validate inputs
  // TODO: Add captchas
  const data: SignInWithPasswordCredentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      // captchaToken
    },
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Login error: ", error);
    redirect("/error");
  }

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
  // TODO: Add captchas
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
  const emailPromotions = formData
    .get("email-promotions")
    ?.toString() as string;

  console.log("emailPromotions: ", emailPromotions);

  const nonceSession = await getSession();

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

  //////////////////

  // Get this whole url
  const fullUrl = headers().get("referer");
  const redirectUrl = getUrl(fullUrl);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: USe Zod to validate inputs
  // TODO: Add captchas
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

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signinWithWallet(
  currentState: { message: string },
  formData: FormData
) {
  // Create supabase client
  const supabase = createClient();

  // type-casting here for convenience
  // TODO: USe Zod to validate inputs
  const address = formData.get("address")?.toString() as string;
  const signature = formData.get("signature")?.toString() as string;

  const nonceSession = await getSession();

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



  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: USe Zod to validate inputs
  // TODO: Add captchas
  const data: SignInWithPasswordCredentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      // captchaToken
    },
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  // Query the user by address
  const { data: user, error: userError } = await supabase
    .from("wallet_users")
    .select("id, address, email")
    .eq("address", address)
    .single();

  // If not registered, return error message
  if ((userError && userError.code == "PGRST116") || !user) {
    console.log(userError);
    return { message: "No account registered with this wallet address" };
  }

  const { error: signError } = await supabase.auth.signInAnonymously({
    options: {
      // TODO: Add captcha
      data: {
        type: "wallet",
        address,
        email: user.email,
      },
    },
  });

  if (signError) {
    console.log(signError);
    return {
      message: "It's not possible to sign in with the wallet at the moment",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
