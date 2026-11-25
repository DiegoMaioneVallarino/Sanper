/*
 * Aplica en orden los archivos de ./migrations que aún
 * no están en schema_migrations. Cada uno en su transacción.
 *
 *   npm run db:migrate
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool, withTransaction } from "./pool";

const migrationsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "migrations",
);

export async function migrate(): Promise<string[]> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version     text PRIMARY KEY,
      applied_at  timestamptz NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query<{ version: string }>(
    "SELECT version FROM schema_migrations",
  );

  const applied = new Set(rows.map((row) => row.version));

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const newlyApplied: string[] = [];

  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = await readFile(
      path.join(migrationsDir, file),
      "utf8",
    );

    await withTransaction(async (client) => {
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (version) VALUES ($1)",
        [file],
      );
    });

    newlyApplied.push(file);
    console.log(`[db] migración aplicada: ${file}`);
  }

  return newlyApplied;
}

const isCli =
  process.argv[1] === fileURLToPath(import.meta.url);

if (isCli) {
  migrate()
    .then((done) => {
      if (done.length === 0) {
        console.log("[db] sin migraciones pendientes");
      }
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
