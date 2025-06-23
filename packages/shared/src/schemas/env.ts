import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});
