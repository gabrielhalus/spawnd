import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {});

export default app;
