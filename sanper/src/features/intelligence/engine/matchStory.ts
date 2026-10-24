import type {
  Story,
} from "../../stories/types/story.types";

import type {
  NormalizedArticle,
  ArticleClassification,
  StoryMatch,
} from "../types/intelligence.types";

import {
  normalizeText,
} from "./normalizeArticle";

const stopWords = new Set([
  "para",
  "como",
  "sobre",
  "entre",
  "desde",
  "hasta",
  "tras",
  "ante",
  "esta",
  "este",
  "estos",
  "estas",
  "mercados",
  "nueva",
  "nuevo",
  "bajo",
  "durante",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    normalizeText(text)
      .split(" ")
      .filter(
        (word) =>
          word.length >= 4 &&
          !stopWords.has(word),
      ),
  );
}

function textSimilarity(
  a: string,
  b: string,
): number {
  const wordsA = tokenize(a);
  const wordsB = tokenize(b);

  if (wordsA.size === 0 || wordsB.size === 0) {
    return 0;
  }

  const intersection = [...wordsA].filter(
    (word) => wordsB.has(word),
  ).length;

  return intersection / Math.min(
    wordsA.size,
    wordsB.size,
  );
}

function sectorSimilarity(
  classification: ArticleClassification,
  story: Story,
): number {
  if (classification.sectors.length === 0) {
    return 0;
  }

  const shared = classification.sectors.filter(
    (sector) => story.sectors.includes(sector),
  ).length;

  return shared / classification.sectors.length;
}
function geographicSimilarity(
  classification: ArticleClassification,
  story: Story,
): number | null {
  const countries = classification.entities
    .filter((entity) => entity.type === "country")
    .map((entity) => normalizeText(entity.name));

  const locations = classification.entities
    .filter((entity) => entity.type === "location")
    .map((entity) => normalizeText(entity.name));

  const detected = [...countries, ...locations];

  if (detected.length === 0) {
    return null;
  }

  const storyGeography = new Set(
    [
      ...story.territories.map((territory) => territory.name),
      story.location?.name ?? "",
    ].map(normalizeText),
  );

  const overlap = detected.filter((entity) =>
    storyGeography.has(entity),
  ).length;

  return overlap / detected.length;
}

function entitySimilarity(
  classification: ArticleClassification,
  story: Story,
): number | null {
  const entities = classification.entities.filter(
    (entity) =>
      entity.type === "company" ||
      entity.type === "organization" ||
      entity.type === "commodity",
  );

  if (entities.length === 0) {
    return null;
  }

  const storyText = normalizeText(
    `${story.title} ${story.summary}`,
  );

  const overlap = entities.filter((entity) =>
    ` ${storyText} `.includes(
      ` ${normalizeText(entity.name)} `,
    ),
  ).length;

  return overlap / entities.length;
}
export function matchStory(
  article: NormalizedArticle,
  classification: ArticleClassification,
  stories: Story[],
): StoryMatch {
  let bestStory: Story | null = null;
  let bestScore = 0;

  for (const story of stories) {
    const titleScore = textSimilarity(
      article.title,
      story.title,
    );

    const descriptionScore = textSimilarity(
      `${article.title} ${article.description}`,
      `${story.title} ${story.summary}`,
    );

    const sectorScore = sectorSimilarity(
      classification,
      story,
    );

    const geoScore = geographicSimilarity(
      classification,
      story,
    );

    const entityScore = entitySimilarity(
      classification,
      story,
    );

    const weightedScores = [
      { value: titleScore, weight: 0.35 },
      { value: descriptionScore, weight: 0.25 },
      { value: sectorScore, weight: 0.15 },
    ];

    if (geoScore !== null) {
      weightedScores.push({
        value: geoScore,
        weight: 0.2,
      });
    }

    if (entityScore !== null) {
      weightedScores.push({
        value: entityScore,
        weight: 0.05,
      });
    }

    const totalWeight = weightedScores.reduce(
      (sum, item) => sum + item.weight,
      0,
    );

    const score =
      weightedScores.reduce(
        (sum, item) =>
          sum + item.value * item.weight,
        0,
      ) / totalWeight;

    if (score > bestScore) {
      bestScore = score;
      bestStory = story;
    }
  }

  if (!bestStory || bestScore < 0.35) {
    return {
      storyId: null,
      confidence: bestScore,
      reason:
        "No se encontró una coincidencia suficiente.",
    };
  }

  return {
    storyId: bestStory.id,
    confidence: bestScore,
    reason:
      `Coincidencia temática, textual y geográfica con "${bestStory.title}".`,
  };
}