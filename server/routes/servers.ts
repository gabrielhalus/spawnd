import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono/tiny";
import { z } from "zod";

const createServerSchema = z.object({
  name: z.string(),
});

interface Server {
  id: number;
  name: string;
  meta: object;
}

const fakeServers: Server[] = [
  {
    id: 0,
    name: "Server 1",
    meta: {},
  },
  {
    id: 1,
    name: "Server 2",
    meta: {},
  },
];

export const serversRoute = new Hono()

  .get("/", async (c) => {
    return c.json({ servers: fakeServers });
  })

  .get("/:id", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const server = fakeServers.find((s) => s.id === id);

    if (!server) {
      return c.notFound();
    }

    return c.json({ server });
  })

  .post("/", zValidator("json", createServerSchema), async (c) => {
    const server = c.req.valid("json");

    fakeServers.push({
      id: fakeServers.length,
      name: server.name,
      meta: {},
    });

    c.status(201);
    return c.json({});
  });
