import pino from "pino";
import pretty from "pino-pretty";
import { pinoLogger } from "hono-pino";

export default function logger() {
  return pinoLogger({
    pino: pino(
      {
        level: process.env.LOG_LEVEL || "info",
      },
      process.env.NODE_ENV === "production" ? undefined : pretty(),
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
