"use server";
import { type NextRequest, NextResponse } from "next/server";
import { Address, isAddress } from "viem";
import { createHmac } from "crypto";

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
  // FIXME: Should be an enviroment value with another value ofc
  const keyHash = "f4ed77bbafb8113811a5c71941b18615";

  return createHmac("sha256", keyHash).update(address).digest("hex");
}

export async function POST(request: Request, res: Response) {
  //
}
