import type {
  ReviewDecision,
  ReviewItem,
  ReviewStats,
} from "../../shared/domain";

import type { Queryable } from "../db/pool";

import {
  linkArticleToStory,
  unlinkArticleFromStory,
} from "./stories.repo";

export async function ensurePendingReview(
  db: Queryable,
  articleId: string,
): Promise<void> {
  await db.query(
    `INSERT INTO reviews (article_id, decision)
     VALUES ($1, 'pending')
     ON CONFLICT (article_id) DO NOTHING`,
    [articleId],
  );
}

interface ReviewRow {
  article_id: string;
  source_id: string;
  source_name: string;
  url: string;
  title: string;
  description: string;
  published_at: Date;
  language: string;
  sectors: ReviewItem["sectors"];
  keywords: string[];
  entities: ReviewItem["entities"];
  status: ReviewItem["status"];
  match_story_id: string | null;
  match_confidence: number;
  match_reason: string;
  decision: ReviewDecision;
  story_id: string | null;
  reviewed_at: Date | null;
}

export async function listReviewItems(
  db: Queryable,
  options: {
    decision?: ReviewDecision;
    limit: number;
  },
): Promise<ReviewItem[]> {
  const { rows } = await db.query<ReviewRow>(
    `SELECT a.id AS article_id,
            a.source_id,
            s.name AS source_name,
            a.url,
            a.title,
            a.description,
            a.published_at,
            a.language,
            an.sectors,
            an.keywords,
            an.entities,
            an.status,
            an.match_story_id,
            an.match_confidence,
            an.match_reason,
            r.decision,
            r.story_id,
            r.reviewed_at
       FROM reviews r
       JOIN articles a          ON a.id = r.article_id
       JOIN sources s           ON s.id = a.source_id
       JOIN article_analysis an ON an.article_id = a.id
      WHERE ($1::text IS NULL OR r.decision = $1)
      ORDER BY an.match_confidence DESC, a.published_at DESC
      LIMIT $2`,
    [options.decision ?? null, options.limit],
  );

  return rows.map((row) => ({
    articleId: row.article_id,
    sourceId: row.source_id,
    sourceName: row.source_name,
    url: row.url,
    title: row.title,
    description: row.description,
    publishedAt: row.published_at.toISOString(),
    language: row.language,
    sectors: row.sectors,
    keywords: row.keywords,
    entities: row.entities,
    status: row.status,
    matchStoryId: row.match_story_id,
    matchConfidence: row.match_confidence,
    matchReason: row.match_reason,
    decision: row.decision,
    approvedStoryId: row.story_id,
    reviewedAt: row.reviewed_at?.toISOString() ?? null,
  }));
}

export async function getReviewStats(
  db: Queryable,
): Promise<ReviewStats> {
  const { rows } = await db.query<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>(
    `SELECT count(*)::int                                         AS total,
            count(*) FILTER (WHERE decision = 'pending')::int     AS pending,
            count(*) FILTER (WHERE decision = 'approved')::int    AS approved,
            count(*) FILTER (WHERE decision = 'rejected')::int    AS rejected
       FROM reviews`,
  );

  return rows[0];
}

/*
 * Registra una decisión editorial:
 * - actualiza el estado actual en `reviews`
 * - agrega una fila inmutable a `review_log`
 * - vincula o desvincula el artículo de su Story
 *
 * Debe llamarse dentro de una transacción.
 */
export async function recordDecision(
  db: Queryable,
  input: {
    articleId: string;
    decision: ReviewDecision;
    storyId: string | null;
    reviewerId: string | null;
    note: string | null;
  },
): Promise<boolean> {
  const previous = await db.query<{
    decision: ReviewDecision;
    story_id: string | null;
  }>(
    `SELECT decision, story_id
       FROM reviews
      WHERE article_id = $1
      FOR UPDATE`,
    [input.articleId],
  );

  const before = previous.rows[0];

  if (!before) return false;

  const storyId =
    input.decision === "approved" ? input.storyId : null;

  await db.query(
    `UPDATE reviews
        SET decision = $2,
            story_id = $3,
            reviewer_id = $4,
            note = $5,
            reviewed_at = CASE WHEN $2 = 'pending' THEN NULL ELSE now() END
      WHERE article_id = $1`,
    [
      input.articleId,
      input.decision,
      storyId,
      input.reviewerId,
      input.note,
    ],
  );

  await db.query(
    `INSERT INTO review_log (article_id, decision, story_id, reviewer_id, note)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      input.articleId,
      input.decision,
      storyId,
      input.reviewerId,
      input.note,
    ],
  );

  if (
    before.decision === "approved" &&
    before.story_id &&
    before.story_id !== storyId
  ) {
    await unlinkArticleFromStory(
      db,
      before.story_id,
      input.articleId,
    );
  }

  if (storyId) {
    await linkArticleToStory(
      db,
      storyId,
      input.articleId,
      "editor",
      input.reviewerId,
    );
  }

  return true;
}
