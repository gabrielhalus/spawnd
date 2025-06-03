import { config } from "@shared/config";

type MojangVersion = {
  id: string;
  type: "release" | "snapshot";
  url: string;
};

type MojangManifest = {
  versions: MojangVersion[];
};

export async function fetchVanilla() {
  const res = await fetch(config.apiUrls.vanilla);
  const data = (await res.json()) as MojangManifest;
  return data.versions
    .filter((v) => v.type === "release")
    .splice(0, config.maxEntries)
    .map((v: any) => ({
      id: v.id,
      type: v.type,
      url: v.url,
    }));
}
