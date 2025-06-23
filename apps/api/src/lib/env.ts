/* eslint-disable node/no-process-env */

import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

dotenv.config({ path: process.env.NODE_ENV === "test" ? path.resolve(".env.test") : undefined });

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  const error = e as z.ZodError;
  console.error("Invalid environment variables:");
  console.error(error.issues);
  process.exit(1);
}

export default env;
