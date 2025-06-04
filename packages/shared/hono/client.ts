import { hc } from "hono/client";
import type { ApiRoutes } from "@backend/app";

const client = hc<ApiRoutes>("http://localhost:3000");
export const api = client.api;
