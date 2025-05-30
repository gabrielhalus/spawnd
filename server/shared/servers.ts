import type { z } from "zod";
import { insertServerSchema, ServerTypeEnum } from "../schemas/servers";

export type ServerType = z.infer<typeof ServerTypeEnum>;

export const createServerSchema = insertServerSchema.omit({
  id: true,
  status: true,
  createdAt: true,
});
