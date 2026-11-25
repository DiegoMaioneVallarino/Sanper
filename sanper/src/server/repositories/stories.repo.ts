import type { Story } from "../../shared/domain";
import type { Queryable } from "../db/pool";

/*
 * Una sola consulta arma la Story completa, con sus
 * territorios, países, artículos y fuentes vinculados.
 */
const storySelect = `
  SELECT
    s.id,
    s.title,
    s.summary,
    s.sectors,
    s.importance,
    s.relevance,
    s.location_name,
    s.latitude,
    s.longitude,
    s.started_at,
    s.updated_at,
    COALESCE((
      SELECT json_agg(json_build_object('code', t.code, 'name', t.name) ORDER BY t.code)
        FROM story_territories t
       WHERE t.story_id = s.id
    ), '[]'::json) AS territories,
    COALESCE((
      SELECT json_agg(json_build_object('countryCode', c.country_code, 'role', c.role)
                      ORDER BY c.role, c.country_code)
        FROM story_countries c
       WHERE c.story_id = s.id
    ), '[]'::json) AS countries,
    COALESCE((
      SELECT array_agg(sa.article_id ORDER BY a.published_at DESC)
        FROM story_articles sa
        JOIN articles a ON a.id = sa.article_id
       WHERE sa.story_id = s.id
    ), '{}') AS article_ids,
    COALESCE((
      SELECT array_agg(DISTINCT a.source_id)
        FROM story_articles sa
        JOIN articles a ON a.id = sa.article_id
       WHERE sa.story_id = s.id
    ), '{}') AS source_ids
  FROM stories s
`;

interface StoryRow {
  id: string;
  title: string;
  summary: string;
  sectors: Story["sectors"];
  importance: Story["importance"];
  relevance: Story["relevance"];
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  started_at: Date;
  updated_at: Date;
  territories: Story["territories"];
  countries: Story["countries"];
  article_ids: string[];
  source_ids: string[];
}

function toStory(row: StoryRow): Story {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    sectors: row.sectors,
    importance: row.importance,
    relevance: row.relevance,
    location:
      row.location_name !== null &&
      row.latitude !== null &&
      row.longitude !== null
        ? {
            name: row.location_name,
            latitude: row.latitude,
            longitude: row.longitude,
          }
        : undefined,
    startedAt: row.started_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    territories: row.territories,
    countries: row.countries,
    articleIds: row.article_ids,
    sourceIds: row.source_ids,
  };
}

export async function listStories(
  db: Queryable,
): Promise<Story[]> {
  const { rows } = await db.query<StoryRow>(
    `${storySelect}
      WHERE s.status = 'active'
      ORDER BY s.updated_at DESC`,
  );

  return rows.map(toStory);
}

export async function getStory(
  db: Queryable,
  id: string,
): Promise<Story | null> {
  const { rows } = await db.query<StoryRow>(
    `${storySelect} WHERE s.id = $1`,
    [id],
  );

  return rows[0] ? toStory(rows[0]) : null;
}

export async function storyExists(
  db: Queryable,
  id: string,
): Promise<boolean> {
  const { rowCount } = await db.query(
    "SELECT 1 FROM stories WHERE id = $1",
    [id],
  );

  return (rowCount ?? 0) > 0;
}

/* Sólo para el seed: crea o reemplaza una Story completa. */
export async function upsertStory(
  db: Queryable,
  story: Story,
): Promise<void> {
  await db.query(
    `INSERT INTO stories (
       id, title, summary, sectors, importance, relevance,
       location_name, latitude, longitude, started_at, updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            summary = EXCLUDED.summary,
            sectors = EXCLUDED.sectors,
            importance = EXCLUDED.importance,
            relevance = EXCLUDED.relevance,
            location_name = EXCLUDED.location_name,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            started_at = EXCLUDED.started_at,
            updated_at = GREATEST(stories.updated_at, EXCLUDED.updated_at)`,
    [
      story.id,
      story.title,
      story.summary,
      story.sectors,
      story.importance,
      story.relevance,
      story.location?.name ?? null,
      story.location?.latitude ?? null,
      story.location?.longitude ?? null,
      story.startedAt,
      story.updatedAt,
    ],
  );

  await db.query(
    "DELETE FROM story_territories WHERE story_id = $1",
    [story.id],
  );

  for (const territory of story.territories) {
    await db.query(
      `INSERT INTO story_territories (story_id, code, name)
       VALUES ($1, $2, $3)`,
      [story.id, territory.code, territory.name],
    );
  }

  await db.query(
    "DELETE FROM story_countries WHERE story_id = $1",
    [story.id],
  );

  for (const country of story.countries) {
    await db.query(
      `INSERT INTO story_countries (story_id, country_code, role)
       VALUES ($1, $2, $3)`,
      [story.id, country.countryCode, country.role],
    );
  }
}

/*
 * Vincula un artículo a una Story y adelanta su
 * updated_at si el artículo es más reciente.
 */
export async function linkArticleToStory(
  db: Queryable,
  storyId: string,
  articleId: string,
  linkedBy: "engine" | "editor" | "seed",
  userId: string | null,
): Promise<void> {
  await db.query(
    `INSERT INTO story_articles (story_id, article_id, linked_by, linked_by_user)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (story_id, article_id) DO NOTHING`,
    [storyId, articleId, linkedBy, userId],
  );

  await db.query(
    `UPDATE stories s
        SET updated_at = GREATEST(s.updated_at, a.published_at)
       FROM articles a
      WHERE s.id = $1 AND a.id = $2`,
    [storyId, articleId],
  );
}

export async function unlinkArticleFromStory(
  db: Queryable,
  storyId: string,
  articleId: string,
): Promise<void> {
  await db.query(
    `DELETE FROM story_articles
      WHERE story_id = $1 AND article_id = $2 AND linked_by <> 'seed'`,
    [storyId, articleId],
  );
}
