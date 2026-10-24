import {
  mockStories,
} from "../../stories/data/mockStories";

import {
  intelligenceFixtures,
} from "../data/intelligence.fixtures";

import {
  processArticle,
} from "./processArticle";

export function runIntelligenceDemo() {
  const results = intelligenceFixtures.map(
    (article) =>
      processArticle(article, {
        stories: mockStories,
      }),
  );

  console.table(
    results.map((result) => ({
      article: result.article.id,
      sectors: result.classification.sectors.join(", "),
      story: result.match.storyId,
      confidence: result.match.confidence.toFixed(3),
      status: result.status,
    })),
  );
console.table(
  results.map((result) => ({
    article: result.article.id,
    sectors: result.classification.sectors.join(", "),
    entities: result.classification.entities
      .map((entity) => entity.name)
      .join(", "),
    story: result.match.storyId,
    confidence: result.match.confidence.toFixed(3),
    status: result.status,
  })),
);
  return results;
}