import { hc } from "hono/client";
import type { ApiRoutes } from "@backend/app";

const client = hc<ApiRoutes>("/");
const api = client.api;

export { api };
