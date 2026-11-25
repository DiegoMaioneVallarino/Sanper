/*
 * Re-export: la fuente única es src/shared/domain.
 */
export type {
  Sector as IntelligenceSector,
  RawArticle,
  NormalizedArticle,
  ExtractedEntity,
  ArticleClassification,
  StoryMatch,
  ProcessingResult,
  ProcessingStatus,
  IntelligenceContext,
  ReviewDecision,
  ReviewItem,
  ReviewStats,
} from "../../../shared/domain";
