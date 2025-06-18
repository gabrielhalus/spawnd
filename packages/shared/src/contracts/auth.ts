import { z } from "zod";

import { insertUserSchema } from "../schemas/users";

// Login
export const loginInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const loginSuccessSchema = z.object({
  success: z.literal(true),
  accessToken: z.string(),
});

const loginErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const loginOutputSchema = z.union([loginSuccessSchema, loginErrorSchema]);

export type LoginInput = z.infer<typeof loginInputSchema>;
export type LoginOutput = z.infer<typeof loginOutputSchema>;

// Register
export const registerInputSchema = insertUserSchema;

const registerSuccessSchema = z.object({
  success: z.literal(true),
  accessToken: z.string(),
});

const registerErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const registerOutputSchema = z.union([registerSuccessSchema, registerErrorSchema]);

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type RegisterOutput = z.infer<typeof registerOutputSchema>;
