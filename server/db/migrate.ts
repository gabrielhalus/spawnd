import { Database } from "bun:sqlite";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const db = new Database("sqlite.db");

const migrationFolder = "./drizzle";
const files = readdirSync(migrationFolder).filter((f) => f.endsWith(".sql"));

for (const file of files.sort()) {
  const sql = readFileSync(join(migrationFolder, file), "utf8");
  db.exec(sql);
  console.log(`✅ Applied migration: ${file}`);
}

process.exit(0);
