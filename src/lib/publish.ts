import type { ServerWebSocket } from "bun";
import { topicPrefix } from "../routes/ws";

let server: Bun.Server | null = null;

export function setServer(s: Bun.Server) {
  server = s;
}

export function publish(topic: string, message: string) {
  if (!server) return;
  server.publish(topic, message);
}

export function publishServerStatus(serverId: string, status: string) {
  const topic = `${topicPrefix}${serverId}`;
  publish(topic, status);
}
