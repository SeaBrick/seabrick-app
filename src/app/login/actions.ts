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
  deleteNonceSession,
  getNonceSession,
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

  deleteNonceSession();
  revalidatePath("/", "layout");

  return { message: `Email sent to your linked email. Ple1ase confirm it` };
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

  const { data: queryData, error: queryError } = await supabase
    .from("wallet_users")
    .select("email")
    .eq("address", address)
    .single();

  if (queryError || !queryData) {
    console.log("Query error at sign in wallet: ", queryError);
    return { message: "Wallet user not found" };
  }

  const email = queryData.email as string;

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: USe Zod to validate inputs
  // TODO: Add captchas
  const data: SignInWithPasswordCredentials = {
    email,
    password: await getUniquePassword(address as Address),
    options: {
      // captchaToken
    },
  };

  const { error: signInError } = await supabase.auth.signInWithPassword(data);

  if (signInError) {
    console.log(signInError);
    return {
      message: "It's not possible to sign in with the wallet at the moment",
    };
  }

  deleteNonceSession();
  revalidatePath("/", "layout");
  redirect("/");
}
