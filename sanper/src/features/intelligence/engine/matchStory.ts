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

    const score =
      titleScore * 0.5 +
      descriptionScore * 0.35 +
      sectorScore * 0.15;

    if (score > bestScore) {
      bestScore = score;
      bestStory = story;
    }
  }

  if (!bestStory || bestScore < 0.35) {
    return {
      storyId: null,
      confidence: bestScore,
      reason: "No se encontró una coincidencia suficiente.",
    };
  }

  return {
    storyId: bestStory.id,
    confidence: bestScore,
    reason: `Coincidencia textual y temática con "${bestStory.title}".`,
  };
}