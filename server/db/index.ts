import { drizzle } from "drizzle-orm/bun-sqlite";
import sqlite from "bun:sqlite";

const queryClient = new sqlite(process.env.DATABASE_URL!);
export const db = drizzle({ client: queryClient });
