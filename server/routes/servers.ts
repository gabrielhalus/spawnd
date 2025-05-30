import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createServerSchema } from "../shared/servers";
import { insertServerSchema, serversTable } from "../schemas/servers";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";

const app = new Hono()

  .get("/", async (c) => {
    const result = await db
      .select()
      .from(serversTable)
      .orderBy(desc(serversTable.createdAt));

    return c.json({ servers: result });
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const server = db
      .select()
      .from(serversTable)
      .where(eq(serversTable.id, id))
      .get();

    if (server == undefined) {
      return c.json({ error: "Not Found" }, 404);
    }

    return c.json({ server });
  })

  .post("/", zValidator("json", createServerSchema), async (c) => {
    const server = insertServerSchema.parse(c.req.valid("json"));

    const [createdServer] = await db
      .insert(serversTable)
      .values(server)
      .returning();

    c.status(201);
    return c.json({ server: createdServer });
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");

    const deletedServer = await db
      .delete(serversTable)
      .where(eq(serversTable.id, id))
      .returning()
      .then((res) => res[0]);

    if (!deletedServer) {
      return c.json({ error: "Not Found" }, 404);
    }

    return c.body(null, 204);
  });

export default app;
