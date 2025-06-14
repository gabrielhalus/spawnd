import { Hono } from "hono";

import tokens from "@/routes/admin/tokens";

export default new Hono()
  .route("/tokens", tokens);
