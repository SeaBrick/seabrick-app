// import { type NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend("re");

// export async function GET(request: NextRequest) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Seabrick <onboarding@resend.dev>",
//       to: ["victor.nanezj@gmail.com"],
//       subject: "Hello man! Works! This is your receipt",
//       html: "<strong>It works! You got your receipt!</strong>",
//     });

//     if (error) {
//       console.error(error);
//       return NextResponse.json({ error }, { status: 500 });
//     }

//     console.log("data: ");
//     console.log(data);

//     return NextResponse.json({ data }, { status: 200 });
//     //
//   } catch (e) {
//     console.log("error:  ", e);

//     let errorMsg = "Error no conocido";
//     if (e instanceof Error) {
//       errorMsg = e.message;
//     }

//     return NextResponse.json({ error: errorMsg }, { status: 500 });
//   }
// }
