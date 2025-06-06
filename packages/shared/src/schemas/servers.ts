import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const serversTable = sqliteTable("servers", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: text("type").notNull(),
});

export type Server = typeof serversTable.$inferSelect;

export const serversSelectSchema = createSelectSchema(serversTable);

export const serversInsertSchema = createInsertSchema(serversTable, {
  name: z.string().min(1).max(255),
  type: z.enum(["vanilla"]),
});

export const createServerSchema = serversInsertSchema.omit({ id: true });

export const updateServerSchema = serversInsertSchema.partial();
