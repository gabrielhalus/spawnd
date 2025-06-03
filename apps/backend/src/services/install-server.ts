import db from "@lib/db";
import env from "@lib/env";
import { fetchJson } from "@lib/fetch-json";
import { publishServerStatus } from "@lib/publish";
import { config } from "@shared/config";
import { Server, serversTable } from "@shared/schemas/servers";
import { write } from "bun";
import { eq } from "drizzle-orm";

export async function installServer(server: Server) {
  const serverDir = `${env.SERVERS_ROOT}/${server.id}`;

  try {
    await db
      .update(serversTable)
      .set({ status: "installing" })
      .where(eq(serversTable.id, server.id));

    publishServerStatus(server.id, "installing");

    const manifest = await fetchJson(config.apiUrls.vanilla);
    const versionMeta = manifest.versions.find(
      (v: any) => v.id === server.version,
    );
    if (!versionMeta) throw new Error(`Version ${server.version} not found`);

    const versionInfo = await fetchJson(versionMeta.url);
    const jarUrl = versionInfo.downloads.server.url;
    const jarPath = `${serverDir}/server.jar`;

    const jarRes = await fetch(jarUrl);
    if (!jarRes.ok) throw new Error("Failed to download server.jar");

    const jarData = new Uint8Array(await jarRes.arrayBuffer());
    await write(jarPath, jarData);

    await write(`${serverDir}/eula.txt`, "eula=true\n");

    await db
      .update(serversTable)
      .set({ status: "stopped" })
      .where(eq(serversTable.id, server.id));

    publishServerStatus(server.id, "stopped");
  } catch (error) {
    await db
      .update(serversTable)
      .set({ status: "error" })
      .where(eq(serversTable.id, server.id));

    publishServerStatus(server.id, "error");
  }
}
