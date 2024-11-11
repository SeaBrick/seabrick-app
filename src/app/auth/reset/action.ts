"use server";
import { createClient } from "@/lib/supabase/server";
import { PasswordResetSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData) {
  // Create supabase client
  const supabase = createClient();

  const {
    data: validatedData,
    success: validationSuccess,
    error: validationError,
  } = PasswordResetSchema.safeParse({
    newPassword: formData.get("newPassword"),
    repeatedPassword: formData.get("repeatedPassword"),
  });

  if (!validationSuccess) {
    console.log(validationError);
    // Just return the first error encountered
    return { error: validationError.errors[0].message };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: validatedData.newPassword,
  });

  if (updateError) {
    console.log("reset password Error: ", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
