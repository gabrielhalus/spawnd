import { Hono } from "hono";

const fakeServers = [
  {
    id: "1",
    name: "Server 1",
    description: "Server 1 description",
  },
  {
    id: "2",
    name: "Server 2",
    description: "Server 2 description",
  },
  {
    id: "3",
    name: "Server 3",
    description: "Server 3 description",
  },
];

export default new Hono()
  .get("/", (c) => c.json({ servers: fakeServers }))
  .get("/:id", (c) => {
    const server = fakeServers.find(
      (server) => server.id === c.req.param("id"),
    );

    if (!server) {
      return c.json({ error: "Server not found" }, 404);
    }

    return c.json({ server });
  });
