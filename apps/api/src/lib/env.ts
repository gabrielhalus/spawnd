/* eslint-disable node/no-process-env */

import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

dotenv.config({ path: process.env.NODE_ENV === "test" ? path.resolve(".env.test") : undefined });

export const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);

export default env;
