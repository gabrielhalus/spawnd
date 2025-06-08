import { Hono } from "hono";
import { logger } from "hono/logger";

import auth from "./routes/auth";
import users from "./routes/users";

const app = new Hono({ strict: false })
  .use("*", logger())
  .basePath("/api")
  .route("/auth", auth)
  .route("/users", users);

export default app;
export type AppType = typeof app;
