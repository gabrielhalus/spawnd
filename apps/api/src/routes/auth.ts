import { zValidator } from "@hono/zod-validator";
import { password } from "bun";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { deleteTokenByRefreshToken, getTokenByRefreshToken, insertToken } from "@/db/queries/tokens";
import { getUserByEmail, insertUser } from "@/db/queries/users";
import { getClientInfo } from "@/helpers/get-client-info";
import { createAccessToken, createRefreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS, validateUser, verifyToken } from "@/lib/auth";
import env from "@/lib/env";
import { getUser } from "@/middlewares/auth";
import { createUserSchema } from "@spawnd/shared/schemas/users";

export default new Hono()
  /**
   * Register a new user
   * @param c - The context
   * @returns The access token
   */
  .post("/register", zValidator("json", createUserSchema), async (c) => {
    const rawUser = await c.req.json();

    const user = createUserSchema.parse(rawUser);
    const hashedPassword = await password.hash(user.password);

    try {
      const { password: _, ...insertedUser } = await insertUser({ ...user, password: hashedPassword });

      const accessToken = await createAccessToken(insertedUser.id);
      const refreshToken = await createRefreshToken(insertedUser.id);

      await insertToken({
        userId: insertedUser.id,
        refreshToken,
        issuedAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
      });

      setCookie(c, "refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_EXPIRATION_SECONDS,
      });

      return c.json({ success: true, accessToken });
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
        return c.json(
          {
            success: false,
            error: "Email is already taken",
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
   * @returns The access token
   */
  .post("/login", async (c) => {
    const credentials = await c.req.json();

    try {
      const userId = await validateUser(credentials);
      if (!userId)
        return c.json({ success: false, error: "Invalid credentials" }, 400);

      const accessToken = await createAccessToken(userId);
      const refreshToken = await createRefreshToken(userId);

      const { userAgent, ip } = getClientInfo(c);

      await insertToken({
        userId,
        refreshToken,
        issuedAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
        userAgent,
        ip,
      });

      setCookie(c, "refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_EXPIRATION_SECONDS,
      });

      return c.json({ success: true, accessToken });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })

  /**
   * Refresh the access token using the refresh token cookie
   * @param c - The context
   * @returns The new access token
   */
  .post("/refresh", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");
    if (!refreshToken) {
      return c.json({ success: false, error: "No refresh token provided" }, 401);
    }

    try {
      const payload = await verifyToken(refreshToken);
      if (!payload) {
        return c.json({ success: false, error: "Invalid refresh token" }, 401);
      }

      const tokenRecord = await getTokenByRefreshToken(refreshToken);
      if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
        return c.json({ success: false, error: "Refresh token expired or invalid" }, 401);
      }

      const accessToken = await createAccessToken(payload.sub);

      return c.json({ success: true, accessToken });
    } catch {
      await deleteTokenByRefreshToken(refreshToken);
      return c.json({ success: false, error: "Invalid refresh token" }, 401);
    }
  })

  /**
   * Logout a user by clearing the refresh token cookie
   * @param c - The context
   * @returns Success
   */
  .post("/logout", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");

    if (refreshToken) {
      await deleteTokenByRefreshToken(refreshToken);
    }

    setCookie(c, "refreshToken", "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: 0,
    });

    return c.json({ success: true });
  })

  /**
   * Get the current user
   * @param c - The context
   * @returns The current user
   */
  .get("/profile", getUser, async (c) => {
    const user = c.var.user;
    return c.json({ success: true, user });
  })

  /**
   * Check if an email is available
   * @param c - The context
   * @returns Whether the email is available
   */
  .get("/email-available", async (c) => {
    const email = c.req.query("email");
    if (!email) {
      return c.json({ success: false, error: "Email is required" }, 400);
    }

    try {
      const user = await getUserByEmail(email); // If you have a getUserByEmail, use that instead
      const available = !user;
      return c.json({ success: true, available });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
