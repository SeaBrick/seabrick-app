"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

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
    console.log("dataResp: ", dataResp);
    console.log("xdd error");
    console.log(error);
    redirect("/error");
  }

  console.log("coool xd");
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

  const { error, data: aver } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    console.log(aver);
    redirect("/error");
  }

  console.log("coool xd");
  revalidatePath("/", "layout");
  redirect("/");
}
