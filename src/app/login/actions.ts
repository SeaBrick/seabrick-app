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

export async function signUpWithWallet(formData: FormData) {
  // Create supabase client
  const supabase = createClient();

  // type-casting here for convenience
  // TODO: USe Zod to validate inputs
  const address = formData.get("address")?.toString() as string;
  const signature = formData.get("signature")?.toString() as string;
  const email = formData.get("email")?.toString() as string;

  // Validating signature
  const isValidSignature = await verifySignature(
    address! as Address,
    signature! as Hex
  );

  // TODO: Handle errors
  //   Redirecting an error if no valid signature
  if (!isValidSignature) {
    console.log("not valid signature");
    return { message: "Not valid signature" };
    // redirect("/error");
  }

  //
  let user: {
    id: string;
    address: string;
  } | null = null;

  const { data: userData, error: userError } = await supabase
    .from("wallet_users")
    .select("id, address")
    .eq("address", address)
    .single();

  user = userData;

  // The query should be an error since the address should be not present
  // to be able to create an account with it
  if (userError && userError.code == "PGRST116") {
    // Create account with this address since is not already taken
    const { error: newUserError } = await supabase
      .from("wallet_users")
      .insert({ address, email });

    if (newUserError) {
      // The Wallet user could not be created
      console.log(`The wallet "${address}" was not created in wallet_address`);
      console.log(newUserError);
      return {
        message: `The account was not created`,
      };
    }

    const { data: newUserData } = await supabase
      .from("wallet_users")
      .select("id, address")
      .eq("address", address)
      .single();

    user = newUserData;

    if (!user) {
      return { message: "Account information not obtained" };
    }

    const { error: anonError } = await supabase.auth.signInAnonymously({
      options: {
        // TODO: Add captcha
        data: {
          type: "wallet",
          address,
          email,
        },
      },
    });

    if (anonError) {
      // The wallet_user was created but the signIn anon was not succesfull
      console.log("It was not possible to sign in anonymously");
      console.log(anonError);
      return {
        message: "It was not possible to sign in with the wallet at the moment",
      };
    }

    revalidatePath("/", "layout");
    redirect("/");
  } else {
    return {
      message: "Wallet address already registered",
    };
  }
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

  // TODO: Handle errors
  //   Redirecting an error if no valid signature
  if (!isValidSignature) {
    console.log("not valid signature");
    return { message: "Not valid signature" };
    // redirect("/error");
  }

  //
  let user: {
    id: string;
    address: string;
  } | null = null;

  const { data: userData, error: userError } = await supabase
    .from("wallet_users")
    .select("id, address")
    .eq("address", address)
    .single();

  user = userData;

  if (userError) {
    // This user error code means that no response with a value was made
    // wich means that the wallet_user is not saved on our database
    // We skip this
    if (userError.code == "PGRST116") {
      // Create a new wallet_user with this address
      const { error: newUserError } = await supabase
        .from("wallet_users")
        .insert({ address });

      if (newUserError) {
        // TODO: handling this error
        // The Wallet user could not be created (it was not created)
        console.log(
          `The wallet "${address}" was not created in wallet_address`
        );
        console.log(newUserError);
        return {
          message: `The wallet "${address}" was not created in wallet_address`,
        };

        redirect("/error");
      }

      const { data: newUserData } = await supabase
        .from("wallet_users")
        .select("id, address")
        .eq("address", address)
        .single();

      user = newUserData;
    } else {
      // TODO: handling this error
      console.log(`It was not able to retrieve wallet "${address}" info`);
      console.log(userError);
      return {
        message: `It was not able to retrieve wallet "${address}" info`,
      };

      redirect("/error");
    }
  }

  if (!user) {
    // TODO: handling this error
    // The Wallet user could not be created (it was not created)
    console.log(`Not wallet_user found or creaetd with wallet "${address}"`);
    return {
      message: `Not wallet_user found or creaetd with wallet "${address}"`,
    };
    redirect("/error");
  }

  const { error: anonError } = await supabase.auth.signInAnonymously({
    options: {
      // TODO: Add captcha
      data: {
        type: "wallet",
        address,
      },
    },
  });

  if (anonError) {
    // TODO: handling this error
    // The wallet_user was created but the signIn anon was not succesfull
    console.log("It was not possible to sign in anonymously");
    console.log(anonError);
    return {
      message: "It was not possible to sign in anonymously",
    };
    redirect("/error");
  }

  revalidatePath("/", "layout");

  redirect("/");
}
