"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  SignUpWithPasswordCredentials,
  SupabaseClient,
} from "@supabase/supabase-js";
import { headers } from "next/headers";
import { getUrl } from "@/lib/utils";
import {
  deleteNonceSession,
  getNonceSession,
  getUniquePassword,
  verifySignature,
} from "@/lib/utils/session";
import { UserAuthRegisterSchema, UserRegisterWalletSchema } from "@/lib/zod";

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

  const { data: dataUser, error: errorUser } = await createClient(true)
    .rpc("get_user_id_by_email", {
      email: validationData.email,
    })
    .returns<{ id: string }[]>();

  // We handle this as not email found
  if (dataUser && dataUser.length > 0) {
    return { error: "Email already taken" };
  }

  if (errorUser) {
    console.error("Error obtaining the User by email");
    console.error(errorUser);
    return { error: "Server internal error" };
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
}

export async function signUpWithWallet(formData: FormData) {
  // Create supabase client
  const supabase = createClient();

  const nonceSession = await getNonceSession();
  if (!nonceSession) {
    return { error: "Nonce session not found" };
  }

  // Validate the incoming data
  const {
    data: validationData,
    success: validationSuccess,
    error: validationError,
  } = UserRegisterWalletSchema.safeParse({
    email: formData.get("email"),
    address: formData.get("address"),
    signature: formData.get("signature"),
  });

  if (!validationSuccess) {
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }

  // Deconstruct for convenience
  const { address, signature, email } = validationData;

  const { data: dataUser, error: errorUser } = await createClient(true)
    .rpc("get_user_id_by_email", {
      email: email,
    })
    .returns<{ id: string }[]>();

  // We handle this as not email found
  if (dataUser && dataUser.length > 0) {
    return { error: "Email already taken" };
  }

  if (errorUser) {
    console.error("Error obtaining the User by email");
    console.error(errorUser);
    return { error: "Server internal error" };
  }

  const { error: walletUserError } = await createClient()
    .from("wallet_users")
    .select("address")
    .eq("address", address?.toLowerCase())
    .single();

  if (
    !walletUserError ||
    (walletUserError && walletUserError.code != "PGRST116")
  ) {
    return { error: "Wallet address already linked" };
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

  const data: SignUpWithPasswordCredentials = {
    email,
    password: await getUniquePassword(address),
    options: {
      data: {
        type: "wallet",
      },
    },
  };

  // Call the register
  const registerResp = await registerInternal(supabase, data);
  console.error("registerResp");
  console.error(registerResp);
  // If we got response from registerInternal, an error happened
  if (registerResp) {
    return registerResp;
  }

  deleteNonceSession();
  revalidatePath("/", "layout");
}
