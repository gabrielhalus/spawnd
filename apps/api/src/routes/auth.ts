import { zValidator } from "@hono/zod-validator";
import { password } from "bun";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { deleteToken, getTokenById, insertToken } from "@/db/queries/tokens";
import { getUserByEmail, insertUser } from "@/db/queries/users";
import { getClientInfo } from "@/helpers/get-client-info";
import { createAccessToken, createRefreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS, validateUser, verifyToken } from "@/lib/auth";
import env from "@/lib/env";
import { getUser } from "@/middlewares/auth";
import { insertUserSchema } from "@spawnd/shared/schemas/users";

export default new Hono()
  /**
   * Register a new user
   * @param c - The context
   * @returns The access token
   */
  .post("/register", zValidator("json", insertUserSchema), async (c) => {
    const rawUser = await c.req.json();

    const user = insertUserSchema.parse(rawUser);
    const hashedPassword = await password.hash(user.password);

    try {
      const { password: _, ...insertedUser } = await insertUser({ ...user, password: hashedPassword });

      const insertedToken = await insertToken({
        userId: insertedUser.id,
        issuedAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
      });

      const accessToken = await createAccessToken(insertedUser.id);
      const refreshToken = await createRefreshToken(insertedUser.id, insertedToken.id);

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

      const { userAgent, ip } = getClientInfo(c);

      const insertedToken = await insertToken({
        userId,
        issuedAt: Date.now(),
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
        userAgent,
        ip,
      });

      const accessToken = await createAccessToken(userId);
      const refreshToken = await createRefreshToken(userId, insertedToken.id);

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
      const payload = await verifyToken(refreshToken, "refresh");
      if (!payload)
        throw new Error("Invalid refresh token");

      const { sub, jti } = payload;
      const tokenRecord = await getTokenById(jti);

      if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
        if (jti)
          await deleteToken(jti);
        return c.json({ success: false, error: "Refresh token expired or invalid" }, 401);
      }

      const accessToken = await createAccessToken(sub);
      return c.json({ success: true, accessToken });
    } catch {
      // Attempt to clean up invalid token if possible
      try {
        const payload = await verifyToken(refreshToken, "refresh");
        if (payload?.jti)
          await deleteToken(payload.jti);
      } catch {}
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
      try {
        const payload = await verifyToken(refreshToken, "refresh");
        if (payload?.jti) {
          await deleteToken(payload.jti);
        }
      } catch {}
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
