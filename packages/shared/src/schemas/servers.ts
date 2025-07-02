import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const servers = sqliteTable("servers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status", { enum: ["online", "offline", "starting", "stopping", "restarting", "crashed"] }).notNull().default("offline"),
  version: text("version").notNull(),
  ipAddress: text("ip_address").notNull(),
  port: integer("port").notNull(),
  maxPlayers: integer("max_players").notNull().default(20),
  currentPlayers: integer("current_players").notNull().default(0),
  worldName: text("world_name").notNull().default("world"),
  gameMode: text("game_mode", { enum: ["survival", "creative", "adventure", "spectator"] }).notNull().default("survival"),
  difficulty: text("difficulty", { enum: ["peaceful", "easy", "normal", "hard"] }).notNull().default("normal"),
  serverJarPath: text("server_jar_path"),
  serverDirectory: text("server_directory").notNull(),
  javaArgs: text("java_args"),
  memoryMin: integer("memory_min").notNull().default(1024),
  memoryMax: integer("memory_max").notNull().default(2048),
  autoStart: integer("auto_start", { mode: "boolean" }).notNull().default(false),
  autoRestart: integer("auto_start", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull().$defaultFn(() => new Date().getTime()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => new Date().getTime()),
});

export const selectServerSchema = createSelectSchema(servers);

export const insertServerSchema = createInsertSchema(servers, {
  name: z.string().min(1, { message: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }),
});
