import env from "@lib/env";
import sqlite from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const queryClient = new sqlite(env.DATABASE_URL);
export const db = drizzle({ client: queryClient });
