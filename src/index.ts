import { setServer } from "./lib/publish";
import { websocket } from "./routes/ws";
import { startInstallWorker } from "./workers/install-worker";

import app from "./app";
import env from "./env";

console.log("🚀 Server running on http://localhost:3000");
const server = Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
  websocket,
});

setServer(server);
startInstallWorker();
