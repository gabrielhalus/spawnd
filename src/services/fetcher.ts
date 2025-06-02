import { CONFIG } from "@/config";

type MojangVersion = {
  id: string;
  type: "release" | "snapshot";
  url: string;
};

type MojangManifest = {
  versions: MojangVersion[];
};

export async function fetchMojang() {
  const res = await fetch(CONFIG.API_URLS.mojang);
  const data = (await res.json()) as MojangManifest;
  return data.versions
    .filter(v => v.type === "release")
    .splice(0, CONFIG.LIMITS.mojangVersions)
    .map((v: any) => ({
      id: v.id,
      type: v.type,
      url: v.url,
    }));
}
