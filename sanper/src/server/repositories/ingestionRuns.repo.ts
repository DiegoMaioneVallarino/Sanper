import type { Queryable } from "../db/pool";

export interface FailedSource {
  sourceId: string;
  error: string;
}

export interface IngestionRun {
  id: number;
  trigger: "schedule" | "manual";
  startedAt: string;
  finishedAt: string | null;
  fetched: number;
  inserted: number;
  duplicates: number;
  failedSources: FailedSource[];
}

export async function startRun(
  db: Queryable,
  trigger: IngestionRun["trigger"],
): Promise<number> {
  const { rows } = await db.query<{ id: string }>(
    `INSERT INTO ingestion_runs (trigger)
     VALUES ($1)
     RETURNING id`,
    [trigger],
  );

  return Number(rows[0].id);
}

export async function finishRun(
  db: Queryable,
  runId: number,
  totals: {
    fetched: number;
    inserted: number;
    duplicates: number;
    failedSources: FailedSource[];
  },
): Promise<void> {
  await db.query(
    `UPDATE ingestion_runs
        SET finished_at = now(),
            fetched = $2,
            inserted = $3,
            duplicates = $4,
            failed_sources = $5::jsonb
      WHERE id = $1`,
    [
      runId,
      totals.fetched,
      totals.inserted,
      totals.duplicates,
      JSON.stringify(totals.failedSources),
    ],
  );
}

export async function listRuns(
  db: Queryable,
  limit: number,
): Promise<IngestionRun[]> {
  const { rows } = await db.query<{
    id: string;
    trigger: IngestionRun["trigger"];
    started_at: Date;
    finished_at: Date | null;
    fetched: number;
    inserted: number;
    duplicates: number;
    failed_sources: FailedSource[];
  }>(
    `SELECT id, trigger, started_at, finished_at,
            fetched, inserted, duplicates, failed_sources
       FROM ingestion_runs
      ORDER BY started_at DESC
      LIMIT $1`,
    [limit],
  );

  return rows.map((row) => ({
    id: Number(row.id),
    trigger: row.trigger,
    startedAt: row.started_at.toISOString(),
    finishedAt: row.finished_at?.toISOString() ?? null,
    fetched: row.fetched,
    inserted: row.inserted,
    duplicates: row.duplicates,
    failedSources: row.failed_sources,
  }));
}
