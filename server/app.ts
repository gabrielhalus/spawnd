import { Hono } from "hono/tiny";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api");

export default app;
export type ApiRoutes = typeof apiRoutes;
