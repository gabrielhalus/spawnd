import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "apps/backend/drizzle",
  schema: "packages/shared/schemas/*",
  dialect: "sqlite",
});
