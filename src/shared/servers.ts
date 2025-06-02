import {
  insertServerSchema,
  serversTable,
  ServerTypeEnum,
} from "@/schemas/servers";
import type { z } from "zod";

export type Server = typeof serversTable.$inferSelect;

export type ServerType = z.infer<typeof ServerTypeEnum>;

export const createServerSchema = insertServerSchema.omit({
  id: true,
  status: true,
  createdAt: true,
});
