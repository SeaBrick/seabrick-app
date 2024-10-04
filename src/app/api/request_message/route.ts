"use server";
import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { generateMessage } from "../utils";

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

export async function POST(request: Request, res: Response) {
  //
}
