import sqlite from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const queryClient = new sqlite(process.env.DATABASE_URL!);
export const db = drizzle({ client: queryClient });
