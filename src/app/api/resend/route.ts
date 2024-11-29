import { sendReceipt } from "@/lib/email/receipts";
import { NextResponse } from "next/server";
import { zeroHash } from "viem";

export async function GET() {
  try {
    const isSend = await sendReceipt(
      "victor.nanezj@gmail.com",
      ["20", "21", "22"],
      zeroHash,
      new Date()
    );
    return NextResponse.json({ isSend }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isSend: false, error }, { status: 500 });
  }
}
