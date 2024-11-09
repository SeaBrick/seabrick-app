import { isAddress, isHex } from "viem";
import { z } from "zod";

/**
 * Schema for Login with email
 */
export const UserAuthSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

/**
 * Schema for Register with email
 */
export const UserAuthRegisterSchema = UserAuthSchema.extend({
  fullName: z.string().min(1, "Name is required"),
});

export const userLoginWalletSchema = z.object({
  address: z.string().refine((value) => isAddress(value), "No valid address"),
  signature: z.string().refine((value) => isHex(value), "No valid signature"),
});
