import { pool, withTransaction } from "../db/pool";

import {
  normalizeText,
  processArticle,
} from "../../shared/engine";

import type { RawArticle } from "../../shared/domain";

import {
  listEnabledSources,
  markSourceFetched,
} from "../repositories/sources.repo";

import {
  findExistingCanonicalUrls,
  insertArticle,
  listRecentOriginals,
  saveAnalysis,
} from "../repositories/articles.repo";

import { listStories } from "../repositories/stories.repo";
import { ensurePendingReview } from "../repositories/reviews.repo";

import {
  finishRun,
  startRun,
  type FailedSource,
  type IngestionRun,
} from "../repositories/ingestionRuns.repo";

import {
  articleId,
  canonicalizeUrl,
  contentHash,
  findDuplicateOf,
  type DuplicateCandidate,
} from "./deduplication.service";

import { fetchFeed } from "./rss.service";

/* Ventana para buscar la misma noticia con otra URL. */
const DUPLICATE_WINDOW_HOURS = 48;

/* Clave del candado: evita dos ingestas a la vez, incluso entre procesos. */
const LOCK_KEY = 72_617_001;

export interface IngestionSummary {
  runId: number;
  fetched: number;
  inserted: number;
  duplicates: number;
  failedSources: FailedSource[];
}

/*
 * Una corrida completa:
 * fuentes → descarga → deduplicación → motor → base → cola de revisión.
 *
 * Devuelve null si ya hay otra corrida en curso.
 */
export async function runIngestion(
  trigger: IngestionRun["trigger"],
): Promise<IngestionSummary | null> {
  const lockClient = await pool.connect();

  try {
    const { rows } = await lockClient.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock($1) AS locked",
      [LOCK_KEY],
    );

    if (!rows[0].locked) {
      return null;
    }

    try {
      return await ingest(trigger);
    } finally {
      await lockClient.query(
        "SELECT pg_advisory_unlock($1)",
        [LOCK_KEY],
      );
    }
  } finally {
    lockClient.release();
  }
}

async function ingest(
  trigger: IngestionRun["trigger"],
): Promise<IngestionSummary> {
  const runId = await startRun(pool, trigger);

  const totals = {
    fetched: 0,
    inserted: 0,
    duplicates: 0,
    failedSources: [] as FailedSource[],
  };

  const sources = await listEnabledSources(pool);
  const stories = await listStories(pool);

  const recent: DuplicateCandidate[] =
    await listRecentOriginals(pool, DUPLICATE_WINDOW_HOURS);

  for (const source of sources) {
    let items;

    try {
      items = await fetchFeed(source);
      await markSourceFetched(pool, source.id, null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      totals.failedSources.push({
        sourceId: source.id,
        error: message,
      });

      await markSourceFetched(pool, source.id, message);
      console.warn(`[ingesta] ${source.id}: ${message}`);
      continue;
    }

    totals.fetched += items.length;

    const withCanonical = items.map((item) => ({
      ...item,
      canonicalUrl: canonicalizeUrl(item.url),
    }));

    const existing = await findExistingCanonicalUrls(
      pool,
      withCanonical.map((item) => item.canonicalUrl),
    );

    for (const item of withCanonical) {
      if (existing.has(item.canonicalUrl)) continue;

      /* El mismo feed puede repetir una URL. */
      existing.add(item.canonicalUrl);

      const id = articleId(source.id, item.guid);
      const hash = contentHash(item.title, item.description);
      const duplicateOf = findDuplicateOf(item.title, hash, recent);

      const raw: RawArticle = {
        id,
        sourceId: source.id,
        externalId: item.guid,
        url: item.url,
        title: item.title,
        description: item.description,
        content: item.content,
        publishedAt: item.publishedAt,
        receivedAt: new Date().toISOString(),
        language: source.language,
      };

      const inserted = await withTransaction(async (client) => {
        const created = await insertArticle(client, {
          id,
          sourceId: source.id,
          externalId: item.guid,
          url: item.url,
          canonicalUrl: item.canonicalUrl,
          contentHash: hash,
          title: item.title,
          description: item.description,
          content: item.content,
          language: source.language,
          normalizedText: normalizeText(
            `${item.title} ${item.description} ${item.content}`,
          ),
          publishedAt: item.publishedAt,
          receivedAt: raw.receivedAt,
          duplicateOf,
        });

        if (!created) return false;

        /* Las copias se guardan pero no se analizan ni se revisan. */
        if (duplicateOf === null) {
          const result = processArticle(raw, { stories });
          await saveAnalysis(client, result);
          await ensurePendingReview(client, id);
        }

        return true;
      });

      if (!inserted) continue;

      if (duplicateOf === null) {
        totals.inserted++;
        recent.push({ id, title: item.title, contentHash: hash });
      } else {
        totals.duplicates++;
      }
    }
  }

  await finishRun(pool, runId, totals);

  console.log(
    `[ingesta] corrida ${runId}: ${totals.fetched} leídas, ` +
      `${totals.inserted} nuevas, ${totals.duplicates} duplicadas, ` +
      `${totals.failedSources.length} fuentes con error`,
  );

  return { runId, ...totals };
}
