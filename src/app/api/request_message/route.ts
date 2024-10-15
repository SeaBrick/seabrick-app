import { type NextRequest, NextResponse } from "next/server";
import { generateMessage } from "../utils";
import { checkAddress } from "@/lib/utils";
// import { checkAddress } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  // Not a valid address value
  if (!checkAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: generateMessage(address) });
}
