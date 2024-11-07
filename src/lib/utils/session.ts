"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { createHmac } from "crypto";
import { Address, getAddress, Hex, verifyMessage } from "viem";

const nonceName = "nonce-session-seabrick";
const keyHash = process.env.MESSAGE_HASH_KEY;
if (!keyHash) {
  throw new Error("Missing MESSAGE_HASH_KEY value");
}

const passwordKey = process.env.SECRET_PASSWORD_KEY;
if (!keyHash) {
  throw new Error("Missing SECRET_PASSWORD_KEY value");
}

export async function generateMessage(
  address: Address,
  nonce: string
): Promise<string> {
  const computedHmac = createHmac("sha256", keyHash!)
    .update(address)
    .update(nonce)
    .digest("hex");

  return `The seabrick site need to verify tour identity by signing this message with your wallet.
    - Wallet address: ${address}
    - Nonce: ${computedHmac}`;
}

export async function verifySignature(
  address: Address,
  nonce: string,
  signature: Hex
): Promise<boolean> {
  const message = await generateMessage(address, nonce);

  return verifyMessage({
    address,
    message,
    signature,
  });
}

export async function getNonceSession(): Promise<string | undefined> {
  const cookieStore = cookies();
  return cookieStore.get(nonceName)?.value;
}

export async function setNonceSession(): Promise<string> {
  // Generate a unique nonce
  const nonce = uuidv4();

  // Store the nonce in cookies
  const cookieStore = cookies();

  cookieStore.set(nonceName, nonce, {
    path: "/",
    httpOnly: true,
    // 10 mins of expiration
    maxAge: 60 * 10,
  });

  return nonce;
}

export async function deleteNonceSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(nonceName);
}

export async function getUniquePassword(address: Address): Promise<string> {
  const unique = createHmac("sha256", passwordKey!)
    .update(getAddress(address))
    .digest("hex");

  return unique;
}
