import { createHmac } from "crypto";
import { Address, Hex, verifyMessage } from "viem";
// import { checkAddress } from "../lib/utils";
// import { NextResponse } from "next/server";

// TODO: Remove from here and use on server only side `"use server"`
const keyHash = process.env.MESSAGE_HASH_KEY;
if (!keyHash) {
  throw new Error("Missing MESSAGE_HASH_KEY value");
}

export function generateMessage(address: Address): string {
  const computedHmac = createHmac("sha256", keyHash!)
    .update(address)
    .digest("hex");

  return `The seabrick site need to verify tour identity by signing this message with your wallet.
  
    - Wallet address: ${address}
    - ID: ${computedHmac}`;
}

export async function verifySignature(
  address: Address,
  signature: Hex
): Promise<boolean> {
  const message = generateMessage(address);

  return verifyMessage({
    address,
    message: message,
    signature,
  });
}
