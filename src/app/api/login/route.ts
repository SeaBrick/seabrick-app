import { type NextRequest, NextResponse } from "next/server";
import { verifySignature } from "../utils";
import { Address, Hex } from "viem";
import { checkAddress } from "@/app/lib/utils";

export async function POST(request: NextRequest) {
  // You can access the FormData here using req.body
  // For FormData, you typically want to parse it using a package like formidable or similar
  const formData = await request.formData();

  // Example: process the address
  const address = formData.get("address")?.toString();
  const message = formData.get("message")?.toString(); // This will be sent after signing in your client code

  // Not a valid address value
  if (!checkAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }
  const isValidSignature = await verifySignature(
    address! as Address,
    message! as Hex
  );

  if (!isValidSignature) {
    return NextResponse.json(
      { error: "Invalid wallet signature" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "ok" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _sign(): Promise<void> {
  //
}
