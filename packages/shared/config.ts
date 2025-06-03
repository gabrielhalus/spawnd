export const config = {
  // Cache duration for external API results
  cacheTTL: 1000 * 60 * 10, // 10 minutes

  // External API URLs
  apiUrls: {
    // Vanilla
    vanilla: "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
  },

  // Max entries for external API results
  maxEntries: 10,

  // Server types
  serverTypes: {
    // Vanilla
    vanilla: "vanilla",
  },
};
