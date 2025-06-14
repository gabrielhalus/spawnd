import { Hono } from "hono";

import { deleteAllTokens, getAllTokens } from "@/db/queries/tokens";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export default new Hono()

  /**
   * Get all tokens
   * @param c - The context
   * @returns All tokens
   */
  .get("/", async (c) => {
    try {
      const tokens = await getAllTokens();
      return c.json({ success: true, tokens });
    }
    catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Delete all tokens
   * @param c - The context
   * @returns Success status
   */
  .delete("/", async (c) => {
    try {
      await deleteAllTokens();
      return c.json({ success: true });
    }
    catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
