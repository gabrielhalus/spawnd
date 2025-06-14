import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

export const tokens = sqliteTable("tokens", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id").notNull(),
  refreshToken: text("refresh_token").notNull().unique(),
  issuedAt: integer("issued_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
  revokedAt: integer("revoked_at"),
  userAgent: text("user_agent"),
  ip: text("ip"),
});

export type Token = typeof tokens.$inferSelect;

export const selectTokenSchema = createSelectSchema(tokens);

export const insertTokenSchema = createInsertSchema(tokens);
