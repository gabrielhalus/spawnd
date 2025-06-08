import { zValidator } from "@hono/zod-validator";
import { createUserSchema } from "@spawnd/shared/schemas/users";
import { password } from "bun";
import { Hono } from "hono";
import { sign } from "hono/jwt";

import { getUserByEmail, insertUser } from "@/db/queries/users";
import env from "@/lib/env";
import { getUser } from "@/middlewares/auth";

export default new Hono()
  /**
   * Register a new user
   * @param c - The context
   * @returns The new user
   */
  .post("/register", zValidator("json", createUserSchema), async (c) => {
    const rawUser = await c.req.json();

    const user = createUserSchema.parse(rawUser);
    const hashedPassword = await password.hash(user.password);

    try {
      const insertedUser = await insertUser({ ...user, password: hashedPassword });
      return c.json({ success: true, user: { ...insertedUser, password: undefined } });
    }
    catch (error: any) {
      if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
        return c.json(
          {
            success: false,
            error: {
              issues: [
                {
                  code: "unique_constraint",
                  message: "Email is already taken",
                  path: ["email"],
                },
              ],
              name: "ZodError",
            },
          },
          400,
        );
      }

      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Login a user
   * @param c - The context
   * @returns The user and token
   */
  .post("/login", async (c) => {
    const credentials = await c.req.json();

    try {
      const user = await getUserByEmail(credentials.email);

      if (!user) {
        return c.json({ success: false, error: "Invalid credentials" }, 401);
      }

      const isPasswordValid = await password.verify(credentials.password, user.password);

      if (!isPasswordValid) {
        return c.json({ success: false, error: "Invalid credentials" }, 401);
      }

      const token = await sign({ 
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
       }, env.JWT_SECRET);

      return c.json({ success: true, user: { ...user, password: undefined }, token });
    }
    catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Get the current user
   * @param c - The context
   * @returns The current user
   */
  .get("/me", getUser, async (c) => {
    const user = c.var.user;
    return c.json({ success: true, user });
  })
