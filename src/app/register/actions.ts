"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Address, Hex } from "viem";
import {
  type SignUpWithPasswordCredentials,
  type SupabaseClient,
  isAuthApiError,
  isAuthError,
} from "@supabase/supabase-js";
import { headers } from "next/headers";
import { getUrl } from "@/lib/utils";
import {
  deleteNonceSession,
  getNonceSession,
  getUniquePassword,
  verifySignature,
} from "@/lib/utils/session";
import {
  UserAuthRegisterSchema,
  UserAuthSchema,
  userLoginWalletSchema,
} from "@/lib/zod";

async function registerInternal(
  supabaseClient: SupabaseClient<never, "public", never>,
  data: SignUpWithPasswordCredentials
) {
  // Get this whole url
  const fullUrl = headers().get("referer");
  const redirectUrl = getUrl(fullUrl);

  // Add the redirect url
  if ("email" in data) {
    if (!data.options) data.options = {};
    data.options.emailRedirectTo = redirectUrl;
  }

  const { error } = await supabaseClient.auth.signUp(data);

  if (error) {
    console.error("Register error: ", error);
    return { error: error.message };
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Validate the incoming data
  const {
    data: validationData,
    success: validationSuccess,
    error: validationError,
  } = UserAuthRegisterSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!validationSuccess) {
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }

  // Create the data object
  const data: SignUpWithPasswordCredentials = {
    email: validationData.email,
    password: validationData.password,
    options: {
      data: {
        type: "email",
        name: validationData.fullName,
      },
    },
  };

  // Call the register
  const registerResp = await registerInternal(supabase, data);

  // If we got response from registerInternal, an error happened
  if (registerResp) {
    return registerResp;
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
