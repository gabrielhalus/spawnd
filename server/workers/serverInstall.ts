import { version, write } from "bun";
import { CONFIG } from "../config";
import { serversTable } from "../schemas/servers";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import type { Server } from "../shared/servers";

async function fetchJson<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

async function installServer(server: Server) {
  const serverDir = `${CONFIG.SERVERS_ROOT}/${server.id}`;

  try {
    console.log(`Installing server ${server.id}`);
    await db
      .update(serversTable)
      .set({ status: "installing" })
      .where(eq(serversTable.id, server.id));

    // === Download Vanilla Server ===
    const manifest = await fetchJson(CONFIG.API_URLS.mojang);
    const versionMeta = manifest.versions.find(
      (v: any) => v.id === server.version,
    );
    if (!versionMeta) throw new Error(`Version ${server.version} not found`);

    const versionInfo = await fetchJson(versionMeta.url);
    const jarUrl = versionInfo.downloads.server.url;
    const jarPath = `${serverDir}/server.jar`;

    const jarRes = await fetch(jarUrl);
    if (!jarRes.ok) throw new Error(`Failed to download server.jar`);
    const jarData = new Uint8Array(await jarRes.arrayBuffer());
    await write(jarPath, jarData);

    // === Write eula.txt ===
    await write(`${serverDir}/eula.txt`, "eula=true\n");

    // === Done ===
    await db
      .update(serversTable)
      .set({ status: "stopped" })
      .where(eq(serversTable.id, server.id));
    console.log(`Server ${server.id} installed`);
  } catch (error) {
    console.error(`Error installing server ${server.id}:`, error);
    await db
      .update(serversTable)
      .set({ status: "error" })
      .where(eq(serversTable.id, server.id));
  }
}

setInterval(async () => {
  const servers = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.status, "pending"));

  for (const server of servers) {
    installServer(server);
  }
}, 5000);
