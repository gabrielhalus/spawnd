// server/shared/servers.ts
import { insertServerSchema } from "../db/schemas/servers";

export const createServerSchema = insertServerSchema.omit({
  createdAt: true,
});
