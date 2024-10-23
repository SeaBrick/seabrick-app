import { type NextRequest, NextResponse } from "next/server";
import { Address, Hex } from "viem";
import { checkAddress } from "@/lib/utils";
import { getSession, verifySignature } from "@/lib/utils/session";

export async function POST(request: NextRequest) {
  // You can access the FormData here using req.body
  // For FormData, you typically want to parse it using a package like formidable or similar
  const formData = await request.formData();

  // Example: process the address
  const address = formData.get("address")?.toString();
  const message = formData.get("signature")?.toString(); // This will be sent after signing in your client code

  const nonceSession = await getSession();

  if (!nonceSession) {
    return NextResponse.json(
      { error: "Nonce session not found" },
      { status: 400 }
    );
  }

  // Not a valid address value
  if (!checkAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }
  const isValidSignature = await verifySignature(
    address! as Address,
    nonceSession,
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
