import { defineConfig } from "drizzle-kit";
import { join } from "node:path";

import env from "@/lib/env";

export default defineConfig({
  schema: join(__dirname, "../../packages/shared/src/schemas/*.ts"),
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
