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

/**
 * Schema for Register with email
 */
export const UserRegisterWalletSchema = userLoginWalletSchema.extend(
  UserAuthSchema.omit({ password: true }).shape
);

const UserPasswordCheckSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  repeatedPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

const matchPasswords = (data: {
  newPassword: string;
  repeatedPassword: string;
}) => data.repeatedPassword === data.newPassword;

const matchPasswordsOptions = {
  message: "Passwords must match",
  // This points the error message to the newPassword field
  path: ["newPassword"],
};

// Schema for password reset
export const PasswordResetSchema = UserPasswordCheckSchema.refine(
  matchPasswords,
  matchPasswordsOptions
);

/**
 * Schema for setting account personal info
 */
export const UserAccountPersonalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"), // It's called 'name' on the form of the account
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  user_type: z.enum(["wallet", "email"]),
});

/** Schema for changing password on Accounts */
export const UserChangePassword = UserPasswordCheckSchema.extend({
  currentPassword: z.string().min(1, "Current password is required"),
}).refine(matchPasswords, matchPasswordsOptions);
