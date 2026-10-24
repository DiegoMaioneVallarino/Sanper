import type {
  RawArticle,
  IntelligenceContext,
  ProcessingResult,
} from "../types/intelligence.types";

import {
  normalizeArticle,
} from "./normalizeArticle";

import {
  classifyArticle,
} from "./classifyArticle";

import {
  matchStory,
} from "./matchStory";

export function processArticle(
  rawArticle: RawArticle,
  context: IntelligenceContext,
): ProcessingResult {
  const article = normalizeArticle(rawArticle);

  const classification = classifyArticle(article);

  const match = matchStory(
    article,
    classification,
    context.stories,
  );

  let status: ProcessingResult["status"];

  if (classification.sectors.length === 0) {
    status = "review_required";
  } else if (
    match.storyId !== null &&
    match.confidence >= 0.7
  ) {
    status = "matched";
  } else if (
    match.storyId !== null
  ) {
    status = "review_required";
  } else {
    status = "new_story";
  }

  return {
    article,
    classification,
    match,
    status,
  };
}