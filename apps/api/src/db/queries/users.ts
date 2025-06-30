import { eq } from "drizzle-orm";

import type { insertUserSchema } from "@spawnd/shared/schemas/users";

import { db } from "@/db";
import { lower, users } from "@spawnd/shared/schemas/users";

/**
 * Get all users.
 *
 * @returns All users.
 */
export async function getAllUsers() {
  return db.select().from(users);
}

/**
 * Get a user by its ID.
 *
 * @param id - The ID to look up.
 * @returns The matching user.
 */
export async function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

/**
 * Get a user by its email.
 *
 * @param email - The email to look up.
 * @returns The matching user.
 */
export async function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(lower(users.email), email.toLowerCase())).get();
}

/**
 * Insert a new user.
 *
 * @param user - The user data to insert.
 * @returns The inserted user.
 */
export async function insertUser(user: typeof insertUserSchema._type) {
  return db.insert(users).values(user).returning().get();
}

/**
 * Delete a user by its ID.
 *
 * @param id - The ID of the user to delete.
 * @returns The deleted user.
 */
export async function deleteUserById(id: string) {
  return db.delete(users).where(eq(users.id, id)).returning().get();
}
