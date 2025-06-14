import { sign, verify } from "hono/jwt"
import env from "@/lib/env"

const SECRET_KEY = env.JWT_SECRET

export const ACCESS_TOKEN_EXPIRATION_SECONDS = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function createAccessToken(userId: string): Promise<string> {
  const payload = {
    sub: userId,
    type: "access",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION_SECONDS
  };

  return await sign(payload, SECRET_KEY)
}

export async function createRefreshToken(userId: string): Promise<string> {
  const payload = {
    sub: userId,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION_SECONDS
  };

  return await sign(payload, SECRET_KEY)
}

export async function verifyToken(token: string) {
  try {
    const payload = await verify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}
