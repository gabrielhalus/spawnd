import { eq } from "drizzle-orm";

import type { insertTokenSchema } from "@spawnd/shared/schemas/tokens";

import { db } from "@/db";
import { tokens } from "@spawnd/shared/schemas/tokens";

/**
 * Get all tokens.
 *
 * @returns All tokens.
 */
export async function getAllTokens() {
  return db.select().from(tokens);
}

/**
 * Get a token by its refresh token.
 *
 * @param id - The ID to look up.
 * @returns The matching token.
 */
export async function getTokenById(id: string) {
  return db.select().from(tokens).where(eq(tokens.id, id)).get();
}

/**
 * Insert a new token.
 *
 * @param token - The token data to insert.
 * @returns The inserted token.
 */
export async function insertToken(token: typeof insertTokenSchema._type) {
  return db.insert(tokens).values(token).returning().get();
}

/**
 * Delete all tokens.
 *
 * @returns The deleted tokens.
 */
export async function deleteAllTokens() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  return db.delete(tokens).returning().all();
}

/**
 * Delete a token by its ID.
 *
 * @param id - The ID of the token to delete.
 * @returns The deleted token.
 */
export async function deleteToken(id: string) {
  return db.delete(tokens).where(eq(tokens.id, id)).returning().get();
}
