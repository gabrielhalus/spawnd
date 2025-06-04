import { config } from "@shared/config";
import { nanoid } from "@shared/lib/nanoid";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const serversTable = sqliteTable("servers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  version: text("version").notNull(),
  status: text("status", {
    enum: [
      "stopped",
      "starting",
      "running",
      "stopping",
      "error",
      "restarting",
      "pending",
      "installing",
    ],
  })
    .notNull()
    .default("pending"),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Server = typeof serversTable.$inferSelect;

export const selectServerSchema = createSelectSchema(serversTable);

export const insertServerSchema = createInsertSchema(serversTable, {
  name: z.string().min(3).max(100),
  type: z.nativeEnum(config.serverTypes),
});

export const createServerSchema = insertServerSchema.omit({
  id: true,
  status: true,
  createdAt: true,
});
