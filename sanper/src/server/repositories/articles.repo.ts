import type { ProcessingResult } from "../../shared/domain";
import type { Queryable } from "../db/pool";

export interface NewArticle {
  id: string;
  sourceId: string;
  externalId: string | null;
  url: string;
  canonicalUrl: string;
  contentHash: string;
  title: string;
  description: string;
  content: string;
  language: string;
  normalizedText: string;
  publishedAt: string;
  receivedAt: string;
  duplicateOf: string | null;
}

/* Devuelve cuáles de estas URLs canónicas ya están guardadas. */
export async function findExistingCanonicalUrls(
  db: Queryable,
  canonicalUrls: string[],
): Promise<Set<string>> {
  if (canonicalUrls.length === 0) return new Set();

  const { rows } = await db.query<{ canonical_url: string }>(
    `SELECT canonical_url
       FROM articles
      WHERE canonical_url = ANY($1::text[])`,
    [canonicalUrls],
  );

  return new Set(rows.map((row) => row.canonical_url));
}

export interface RecentArticleRef {
  id: string;
  title: string;
  contentHash: string;
}

/*
 * Notas originales (no duplicadas) recientes,
 * para detectar la misma noticia con otra URL.
 */
export async function listRecentOriginals(
  db: Queryable,
  hours: number,
): Promise<RecentArticleRef[]> {
  const { rows } = await db.query<{
    id: string;
    title: string;
    content_hash: string;
  }>(
    `SELECT id, title, content_hash
       FROM articles
      WHERE duplicate_of IS NULL
        AND published_at > now() - make_interval(hours => $1)`,
    [hours],
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    contentHash: row.content_hash,
  }));
}

export async function insertArticle(
  db: Queryable,
  article: NewArticle,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `INSERT INTO articles (
       id, source_id, external_id, url, canonical_url, content_hash,
       title, description, content, language, normalized_text,
       published_at, received_at, duplicate_of
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT DO NOTHING`,
    [
      article.id,
      article.sourceId,
      article.externalId,
      article.url,
      article.canonicalUrl,
      article.contentHash,
      article.title,
      article.description,
      article.content,
      article.language,
      article.normalizedText,
      article.publishedAt,
      article.receivedAt,
      article.duplicateOf,
    ],
  );

  return (rowCount ?? 0) > 0;
}

export async function saveAnalysis(
  db: Queryable,
  result: ProcessingResult,
): Promise<void> {
  await db.query(
    `INSERT INTO article_analysis (
       article_id, engine_version, sectors, keywords, entities,
       status, match_story_id, match_confidence, match_reason
     )
     VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)
     ON CONFLICT (article_id) DO UPDATE
        SET engine_version = EXCLUDED.engine_version,
            sectors = EXCLUDED.sectors,
            keywords = EXCLUDED.keywords,
            entities = EXCLUDED.entities,
            status = EXCLUDED.status,
            match_story_id = EXCLUDED.match_story_id,
            match_confidence = EXCLUDED.match_confidence,
            match_reason = EXCLUDED.match_reason,
            processed_at = now()`,
    [
      result.article.id,
      result.engineVersion,
      result.classification.sectors,
      result.classification.keywords,
      JSON.stringify(result.classification.entities),
      result.status,
      result.match.storyId,
      result.match.confidence,
      result.match.reason,
    ],
  );
}
