import Sqlite from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import env from "@/lib/env";

const queryClient = new Sqlite(env.DATABASE_URL);

export const db = drizzle({ client: queryClient });
