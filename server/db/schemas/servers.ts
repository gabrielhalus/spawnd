import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "../../lib/nanoid";
import { CONFIG } from "../../config";

export const serversTable = sqliteTable("servers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  version: text("version").notNull(),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const ServerTypeEnum = z.enum(CONFIG.SERVER_TYPES);

export const insertServerSchema = createInsertSchema(serversTable, {
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be 100 characters at most"),
  type: ServerTypeEnum,
  version: z
    .string()
    .regex(
      /^\d+\.\d+\.\d+$/,
      "Version must follow the format: major.minor.patch (e.g., 1.0.0)",
    ),
});

export const selectServerSchema = createSelectSchema(serversTable);
