import { Database } from "bun:sqlite";
import fs from "fs";
import { dirname, join, resolve } from "path";

const rawDbPath = process.env.DATABASE_URL!;
const dbPath = resolve(process.cwd(), rawDbPath);

if (!fs.existsSync(dbPath)) {
  const dir = dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dbPath, "");
}

const db = new Database(dbPath!);

const migrationFolder = "./drizzle";
const files = fs.readdirSync(migrationFolder).filter((f) => f.endsWith(".sql"));

for (const file of files.sort()) {
  const sql = fs.readFileSync(join(migrationFolder, file), "utf8");
  db.exec(sql);
  console.log(`✅ Applied migration: ${file}`);
}

process.exit(0);
