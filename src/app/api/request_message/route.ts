import { type NextRequest, NextResponse } from "next/server";
import { checkAddress } from "@/lib/utils";
import { generateMessage, setNonceSession } from "@/lib/utils/session";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  // Not a valid address value
  if (!checkAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  // Generate a nonce and save it on the session
  const nonceGenerated = await setNonceSession();

  return NextResponse.json({
    message: await generateMessage(address, nonceGenerated),
  });
}
