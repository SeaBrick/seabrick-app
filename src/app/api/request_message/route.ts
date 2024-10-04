"use server";
import { type NextRequest, NextResponse } from "next/server";
import { Address, isAddress } from "viem";
import { createHmac } from "crypto";

const keyHash = process.env.MESSAGE_HASH_KEY;
if (!keyHash) {
  throw new Error("Missing MESSAGE_HASH_KEY value");
}

export async function GET(request: NextRequest, response: NextResponse) {
  const address = request.nextUrl.searchParams.get("address");

  // Not a valid address value
  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: generateMessage(address) });
}

function generateMessage(address: Address): string {
  const computedHmac = createHmac("sha256", keyHash!)
    .update(address)
    .digest("hex");

  return `The seabrick site need to verify tour identity by signing this message with your wallet.

  - Wallet address: ${address}
  - ID: ${computedHmac}`;
}

export async function POST(request: Request, res: Response) {
  //
}
