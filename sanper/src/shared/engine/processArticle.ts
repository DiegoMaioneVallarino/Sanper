import type {
  RawArticle,
  IntelligenceContext,
  ProcessingResult,
} from "../domain";

import { normalizeArticle } from "./normalize";
import { classifyArticle } from "./classify";
import { matchStory } from "./matchStory";

/*
 * Se guarda con cada análisis para poder reprocesar
 * y comparar versiones del motor.
 */
export const ENGINE_VERSION = "rules-0.2";

export const MATCH_AUTO_THRESHOLD = 0.7;

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
    match.confidence >= MATCH_AUTO_THRESHOLD
  ) {
    status = "matched";
  } else if (match.storyId !== null) {
    status = "review_required";
  } else {
    status = "new_story";
  }

  return {
    article,
    classification,
    match,
    status,
    engineVersion: ENGINE_VERSION,
  };
}
