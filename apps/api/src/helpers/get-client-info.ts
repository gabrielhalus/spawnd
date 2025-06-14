import type { Context } from "hono";

export function getClientInfo(c: Context) {
  const raw = c.req.raw;
  const forwardedFor = raw.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() || "::1";
  const userAgent = raw.headers.get("user-agent") || "";

  return { ip, userAgent };
}
