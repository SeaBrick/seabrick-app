"use server";

export async function changeAccountDetails(
  currentState: { message: string },
  formData: FormData
) {
  //

  console.log("pave");

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  await delay(5000);

  return { message: "error" };
}
