import type { AppType } from "@spawnd/api";

import { hc } from "hono/client";

export const client = hc<AppType>("/");
export const api = client.api;
