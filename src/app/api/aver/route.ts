import { mintSeabrickTokens } from "@/lib/contracts/transactions";
import { NextResponse } from "next/server";

export async function GET() {
  const isMinted = await mintSeabrickTokens(
    "0x304152266BD626c6D718ca03385F4498D933D168",
    2
  );

  if (isMinted) {
    return NextResponse.json({
      message: "Tokens minted",
    });
  } else {
    return NextResponse.json(
      {
        message: "Failed to mint tokens",
      },
      { status: 409 }
    );
  }
}
