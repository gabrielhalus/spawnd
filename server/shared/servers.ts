import type { z } from "zod";
import { insertServerSchema, ServerTypeEnum } from "../db/schemas/servers";

export type ServerType = z.infer<typeof ServerTypeEnum>;

export const createServerSchema = insertServerSchema.omit({
  createdAt: true,
});
