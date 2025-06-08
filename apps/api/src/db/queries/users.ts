import type { insertUserSchema } from "@spawnd/shared/schemas/users";

import { lower, users } from "@spawnd/shared/schemas/users";
import { eq } from "drizzle-orm";

import { db } from "@/db";

/**
 * Get all users
 * @returns All users
 */
export async function getAllUsers() {
  return db.select().from(users);
}

/**
 * Get a user by their ID
 * @param id - The ID of the user
 * @returns The user
 */
export async function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

/**
 * Get a user by their email
 * @param email - The email of the user
 * @returns The user
 */
export async function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(lower(users.email), email.toLowerCase())).get();
}

/**
 * Insert a user
 * @param user - The user to insert
 * @returns The inserted user
 */
export async function insertUser(user: typeof insertUserSchema._type) {
  return db.insert(users).values(user).returning().get();
}
