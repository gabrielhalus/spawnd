import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

export const { upgradeWebSocket, websocket } = createBunWebSocket();

export const topicPrefix = "server-";

const app = new Hono().get(
  "/server-status",
  upgradeWebSocket((c) => {
    const serverId = c.req.query("id");
    if (!serverId) throw new Error("Missing server ID");

    const topic = `${topicPrefix}${serverId}`;

    return {
      onOpen(_, ws) {
        const rawWs = ws.raw as ServerWebSocket;
        rawWs.subscribe(topic);

        console.log(`→ Client connected to ${topic}`);
      },

      onClose(_, ws) {
        const rawWs = ws.raw as ServerWebSocket;
        rawWs.unsubscribe(topic);

        console.log(`← Client disconnected from ${topic}`);
      },
    };
  }),
);

export default app;
