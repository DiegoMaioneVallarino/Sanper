import type { Queryable } from "../db/pool";
import type { SourceSeed } from "../sources/rssSources";

export interface SourceRow {
  id: string;
  name: string;
  url: string;
  kind: string;
  language: string;
  reliability: number;
}

export async function listEnabledSources(
  db: Queryable,
): Promise<SourceRow[]> {
  const { rows } = await db.query<SourceRow>(
    `SELECT id, name, url, kind, language,
            reliability::float AS reliability
       FROM sources
      WHERE enabled
      ORDER BY id`,
  );

  return rows;
}

export async function markSourceFetched(
  db: Queryable,
  sourceId: string,
  error: string | null,
): Promise<void> {
  await db.query(
    `UPDATE sources
        SET last_fetched_at = now(),
            last_error = $2
      WHERE id = $1`,
    [sourceId, error],
  );
}

export async function upsertSource(
  db: Queryable,
  source: SourceSeed,
): Promise<void> {
  await db.query(
    `INSERT INTO sources (id, name, url, kind, language, reliability, enabled)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            url = EXCLUDED.url,
            kind = EXCLUDED.kind,
            language = EXCLUDED.language,
            reliability = EXCLUDED.reliability`,
    [
      source.id,
      source.name,
      source.url,
      source.kind,
      source.language,
      source.reliability,
      source.enabled,
    ],
  );
}
