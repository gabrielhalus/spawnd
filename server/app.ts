import { Hono } from "hono/tiny";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

import { serversRoute } from "./routes/servers";
import { serverVersionRoutes } from "./routes/server-versions";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/server-versions", serverVersionRoutes)
  .route("/servers", serversRoute);

app.use("/*", serveStatic({ root: "./frontend/dist" }));
app.use("*", serveStatic({ root: "./frontend/dist", path: "index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
