/*
 * Comprobación rápida del motor, sin base de datos:
 *   npx tsx src/shared/engine/engine.check.ts
 */
import { mockStories } from "../../features/stories/data/mockStories";
import { processArticle } from "./processArticle";
import { spanishFixtures } from "./fixtures/articles.es";
import { englishFixtures } from "./fixtures/articles.en";

const results = [...spanishFixtures, ...englishFixtures].map(
  (article) => processArticle(article, { stories: mockStories }),
);

console.table(
  results.map((r) => ({
    id: r.article.id,
    lang: r.article.language,
    sectors: r.classification.sectors.join(", "),
    entities: r.classification.entities.map((e) => e.name).join(", "),
    story: r.match.storyId,
    confidence: r.match.confidence.toFixed(3),
    status: r.status,
  })),
);

const unclassified = results.filter(
  (r) => r.classification.sectors.length === 0,
);

if (unclassified.length > 0) {
  console.error(
    "Sin sector:",
    unclassified.map((r) => r.article.id),
  );
  process.exit(1);
}
