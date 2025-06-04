import { fetchVanilla } from "@services/fetcher";
import { config } from "@shared/config";
import { Hono } from "hono";

type ServerVersionResult = {
  vanilla: any[];
  errors: string[];
};

let cache: { data: ServerVersionResult; expiresAt: number } | null = null;

const app = new Hono().get("/", async (c) => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return c.json(cache.data);
  }

  const errors: string[] = [];

  const [vanilla] = await Promise.all([
    fetchVanilla().catch((e) => {
      errors.push("mojang: " + e.message);
      return [];
    }),
  ]);

  const result: ServerVersionResult = { vanilla, errors };
  cache = { data: result, expiresAt: now + config.cacheTTL };
  return c.json(result);
});

export default app;
