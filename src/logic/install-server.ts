import { write } from "bun";
import { db } from "../lib/db";
import { CONFIG } from "../config";
import { fetchJson } from "../lib/fetch-json";
import { publishServerStatus } from "../lib/publish";
import { serversTable } from "../schemas/servers";
import { eq } from "drizzle-orm";
import type { Server } from "../shared/servers";

export async function installServer(server: Server) {
  const serverDir = `${CONFIG.SERVERS_ROOT}/${server.id}`;

  try {
    await db
      .update(serversTable)
      .set({ status: "installing" })
      .where(eq(serversTable.id, server.id));

    publishServerStatus(server.id, "installing");

    const manifest = await fetchJson(CONFIG.API_URLS.mojang);
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
