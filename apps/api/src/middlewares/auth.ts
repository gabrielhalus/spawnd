import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

import type { UserProfile } from "@spawnd/shared/schemas/users";

import { getUserById } from "@/db/queries/users";
import env from "@/lib/env";

type Env = {
  Variables: {
    user: UserProfile;
  };
};

const factory = createFactory<Env>();

/**
 * Get the user from the JWT token
 * @param c - The context
 * @param next - The next middleware
 * @returns The user
 */
export const getUser = factory.createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  let decoded;
  try {
    decoded = await verify(token, env.JWT_SECRET);
  }
  catch {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const user = await getUserById(decoded.sub as string);

  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const { password: _, ...userProfile } = user;
  c.set("user", userProfile);

  await next();
});
