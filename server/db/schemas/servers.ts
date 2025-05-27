import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const serversTable = sqliteTable("servers", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
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
});

// Schema for selecting a Server - can be used to validate API requests
export const selectServerSchema = createSelectSchema(serversTable);
