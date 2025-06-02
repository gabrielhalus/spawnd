import { db } from "@/lib/db";
import { installServer } from "@/logic/install-server";
import { serversTable } from "@/schemas/servers";
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
