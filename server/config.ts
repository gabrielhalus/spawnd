export const CONFIG = {
  // Cache duration for external API results (in milliseconds)
  CACHE_TTL: 10 * 60 * 1000, // 10 minutes

  // Exertnal API URLs
  API_URLS: {
    mojang: "https://piston-meta.mojang.com/mc/game/version_manifest.json",
  },

  // Max entries to keep from upstream APIs
  LIMITS: {
    mojangVersions: 5,
  },

  // Supported Minecraft server types
  SERVER_TYPES: ["vanilla", "fabric", "paper", "forge"] as const,
};
