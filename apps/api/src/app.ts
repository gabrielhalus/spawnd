import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

import auth from "@/routes/auth";
import users from "@/routes/users";
import serveEmojiFavicon from "./middlewares/serve-emoji-favicon";

const app = new Hono({ strict: false });

// Middleware
app.use(logger(), serveEmojiFavicon("🔥"));

// API routes
app.basePath("/api")
  .route("/auth", auth)
  .route("/users", users);

// Serve static files from the React Build
app.use("/*", serveStatic({ root: "../web/dist" }))
app.use("*", serveStatic({ root: "../web/dist", path: "index.html" }));

export default app;
