import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: './server/db/schemas/*',
  dialect: 'sqlite',
  dbCredentials: {
    url: "./sqlite.db",
  },
})
