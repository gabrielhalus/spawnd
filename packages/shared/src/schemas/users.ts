import type { SQL } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  createdAt: integer("created_at").notNull().$defaultFn(() => new Date().getTime()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => new Date().getTime()),
});

export type User = typeof users.$inferSelect;
export type UserProfile = Omit<User, "password">;

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(1, { message: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }).max(20, { message: "Name must be less than 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});

export function lower(email: AnySQLiteColumn): SQL {
  return sql`(lower(${email}))`;
}
