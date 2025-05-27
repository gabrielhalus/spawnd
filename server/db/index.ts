import { drizzle } from "drizzle-orm/better-sqlite3";
import sqlite from "bun:sqlite";

const queryClient = new sqlite("../../sqlite.db");
export const db = drizzle({ client: queryClient });
