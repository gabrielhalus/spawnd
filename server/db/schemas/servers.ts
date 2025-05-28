import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "../../lib/nanoid";

export const serversTable = sqliteTable("servers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: text("type", { enum: ["vanilla"] }).notNull(),
  version: text("version").notNull(),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Schema for inserting a Server - can be used to validate API requests
export const insertServerSchema = createInsertSchema(serversTable, {
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be 100 characters at most"),
  version: z
    .string()
    .regex(
      /^\d+\.\d+\.\d+$/,
      "Version must follow the format: major.minor.patch (e.g., 1.0.0)",
    ),
});

// Schema for selecting a Server - can be used to validate API requests
export const selectServerSchema = createSelectSchema(serversTable);
