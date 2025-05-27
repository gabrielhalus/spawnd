import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono/tiny";
import { createServerSchema } from "../shared/servers";
import { insertServerSchema, serversTable } from "../db/schemas/servers";
import { db } from "../db";
import { eq } from "drizzle-orm";

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

  .post("/", zValidator("json", createServerSchema), async (c) => {
    const server = c.req.valid("json");

    const validatedServer = insertServerSchema.parse({
      ...server,
    });

    const result = await db
      .insert(serversTable)
      .values(validatedServer)
      .returning();

    c.status(201);
    return c.json(result);
  })

  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const deletedServer = await db
      .delete(serversTable)
      .where(eq(serversTable.id, id))
      .returning()
      .then((res) => res[0]);

    if (!deletedServer) {
      return c.notFound();
    }

    return c.json(deletedServer);
  });
