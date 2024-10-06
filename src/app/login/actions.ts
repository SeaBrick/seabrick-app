"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { verifySignature } from "../api/utils";
import { Address, Hex } from "viem";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: USe Zod to validate inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: dataResp } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Login error");
    if (dataResp) {
      console.log("data response with error: ", dataResp);
    }
    console.log("error: ", error);
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
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: dataResp } = await supabase.auth.signUp(data);

  if (error) {
    console.log("Login error");
    if (dataResp) {
      console.log("data response with error: ", dataResp);
    }
    console.log("error: ", error);
    redirect("/error");
  }

  console.log("coool xd");
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signinWithWallet(formData: FormData) {
  const address = formData.get("address")?.toString() as string;
  const signature = formData.get("signature")?.toString() as string;

  const isValidSignature = await verifySignature(
    address! as Address,
    signature! as Hex
  );

  if (!isValidSignature) {
    console.log("not valid signature");
    redirect("/error");
  }
}
