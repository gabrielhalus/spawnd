import { Hono } from "hono";
import { logger } from "hono/logger";

import servers from "./routes/servers";

const app = new Hono({ strict: false })
  .basePath("/api")
  .route("/servers", servers);

app.use("*", logger());

export default app;
export type AppType = typeof app;
