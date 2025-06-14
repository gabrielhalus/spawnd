import { password } from "bun";
import { sign, verify } from "hono/jwt";

import { getUserByEmail } from "@/db/queries/users";
import env from "@/lib/env";

const SECRET_KEY = env.JWT_SECRET;

export const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type JwtPayload = {
  sub: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
};

export async function validateUser({ email, password: pwd }: { email: string; password: string }): Promise<string | null> {
  const user = await getUserByEmail(email);
  if (user && await password.verify(pwd, user.password)) {
    return user.id;
  }

  return null;
}

export async function createAccessToken(userId: string): Promise<string> {
  const payload: JwtPayload = {
    sub: userId,
    type: "access",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION_SECONDS,
  };

  return await sign(payload, SECRET_KEY);
}

export async function createRefreshToken(userId: string): Promise<string> {
  const payload: JwtPayload = {
    sub: userId,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION_SECONDS,
  };

  return await sign(payload, SECRET_KEY);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const payload = await verify(token, SECRET_KEY) as JwtPayload;
    return payload;
  }
  catch {
    return null;
  }
}
