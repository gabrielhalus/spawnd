import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { serversTable } from "../schemas/servers";
import { installServer } from "../logic/install-server";

export function startInstallWorker(interval = 5000) {
  setInterval(async () => {
    const servers = await db
      .select()
      .from(serversTable)
      .where(eq(serversTable.status, "pending"));

    for (const server of servers) {
      installServer(server);
    }
  }, interval);
}
