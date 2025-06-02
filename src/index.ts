import app from "./app";
import { setServer } from "./lib/publish";
import { websocket } from "./routes/ws";
import { startInstallWorker } from "./workers/installWorker";

const server = Bun.serve({
  fetch: app.fetch,
  websocket,
});

setServer(server);
startInstallWorker();

console.log("🚀 Server running on http://localhost:3000");
