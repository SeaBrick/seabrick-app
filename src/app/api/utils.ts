import { createHmac } from "crypto";
import { Address } from "viem";

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
