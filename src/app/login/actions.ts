"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Address, Hex } from "viem";
import { verifySignature } from "../api/utils";
import type {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

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

  // Validating signature
  const isValidSignature = await verifySignature(
    address! as Address,
    signature! as Hex
  );

  // Return error message if not valid signature
  if (!isValidSignature) {
    return { message: "Not valid signature" };
  }

  // Validating that email is not already taken
  const { data: emailIsTaken } = await supabase.rpc("check_email_exists", {
    email_input: email,
  });

  if (emailIsTaken) {
    return { message: "Email already taken2" };
  }

  const { error: userError } = await supabase
    .from("wallet_users")
    .select("id, address, email")
    .eq("address", address)
    .single();

  // The query should be an error since the address should be not present
  if (!userError) {
    return {
      message: "Wallet address already registered",
    };
  }

  // The `PGRST116` is an error for not found matches (that will indicate that the address is not used)
  // But if the error code is NOT `PGRST116`, then something else happened
  if (userError.code !== "PGRST116") {
    console.log(userError);
    return {
      message: "Something wrong happened",
    };
  }

  // Create account with this address since is not already taken
  const { error: newUserError } = await supabase
    .from("wallet_users")
    .insert({ address, email });

  if (newUserError) {
    if (newUserError.code === "23505") {
      return { message: "Email already taken" };
    }

    // The Wallet user could not be created
    console.log(newUserError);
    return {
      message: `The account was not created`,
    };
  }

  const { data: newUserData } = await supabase
    .from("wallet_users")
    .select("id, address, email")
    .eq("address", address)
    .single();

  if (!newUserData) {
    return { message: "Account information not obtained" };
  }

  const { error: signError } = await supabase.auth.signInAnonymously({
    options: {
      // TODO: Add captcha
      data: {
        type: "wallet",
        address,
        email: newUserData.email,
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

  // Validating signature
  const isValidSignature = await verifySignature(
    address! as Address,
    signature! as Hex
  );

  // Return error message if not valid signature
  if (!isValidSignature) {
    return { message: "Not valid signature" };
  }

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
