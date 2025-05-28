import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono/tiny";
import { createServerSchema } from "../shared/servers";
import { insertServerSchema, serversTable } from "../db/schemas/servers";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";

export const serversRoute = new Hono()

  .get("/", async (c) => {
    const servers = await db
      .select()
      .from(serversTable)
      .orderBy(desc(serversTable.createdAt));

    return c.json({ servers });
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
