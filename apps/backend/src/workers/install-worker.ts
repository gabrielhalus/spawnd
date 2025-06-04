import { db } from "@lib/db";
import { installServer } from "@services/install-server";
import { serversTable } from "@shared/schemas/servers";
import { eq } from "drizzle-orm";

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
