import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { Hono } from "hono/tiny";

import notFound from "./middlewares/not-found";
import onError from "./middlewares/on-error";

import serverVersionRoutes from "./routes/server-versions";
import serversRoutes from "./routes/servers";
import wsRoutes from "./routes/ws";

const app = new Hono();

app.use("*", logger());
app.notFound(notFound);
app.onError(onError);

const apiRoutes = app
  .basePath("/api")
  .route("/servers", serversRoutes)
  .route("/server-versions", serverVersionRoutes);

app.basePath("/ws").route("/", wsRoutes);

app.use("/*", serveStatic({ root: "./frontend/dist" }));
app.use("*", serveStatic({ root: "./frontend/dist", path: "index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
