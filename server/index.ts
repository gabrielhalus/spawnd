import app from "./app";

Bun.serve({
  fetch: app.fetch,
  hostname: "0.0.0.0",
  port: 3000,
});

console.log("🚀 Server running on http://localhost:3000");
