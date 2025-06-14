import { Hono } from "hono";
import { logger } from "hono/logger";

import auth from "@/routes/auth";
import users from "@/routes/users";
import serveEmojiFavicon from "./middlewares/serve-emoji-favicon";

const app = new Hono({ strict: false });

app.use(logger(), serveEmojiFavicon("🔥"));

app.basePath("/api")
  .route("/auth", auth)
  .route("/users", users);

export default app;
