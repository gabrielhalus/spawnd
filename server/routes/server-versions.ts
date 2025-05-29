import { Hono } from "hono";
import { CONFIG } from "../config";
import { fetchMojang } from "../services/fetcher";

type ServerVersionResult = {
  mojang: any[];
  errors: string[];
};

let cache: { data: ServerVersionResult; expiresAt: number } | null = null;

const app = new Hono().get("/", async (c) => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    console.log("Use cache");
    return c.json(cache.data);
  }

  const errors: string[] = [];

  const [mojang] = await Promise.all([
    fetchMojang().catch((e) => {
      errors.push("mojang: " + e.message);
      return [];
    }),
  ]);

  const result: ServerVersionResult = { mojang, errors };
  cache = { data: result, expiresAt: now + CONFIG.CACHE_TTL };
  return c.json(result);
});

export default app;
