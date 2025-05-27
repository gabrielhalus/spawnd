import { drizzle } from "drizzle-orm/bun-sqlite";
import sqlite from "bun:sqlite";

const queryClient = new sqlite("./sqlite.db");
export const db = drizzle({ client: queryClient });
