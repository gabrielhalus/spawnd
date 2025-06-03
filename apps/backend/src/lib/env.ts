import { z } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
  DATABASE_URL: z.string(),
  SERVERS_ROOT: z.string(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  const error = e as z.ZodError;
  console.error("❌ Invalid env:");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
