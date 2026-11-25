import type { Sector } from "./sectors";
import type { Story } from "./story";

/* Nota tal como llega de una fuente externa. */
export interface RawArticle {
  id: string;
  sourceId: string;
  externalId?: string;
  url: string;
  title: string;
  description: string;
  content?: string;
  publishedAt: string;
  receivedAt: string;
  language: string;
}

export interface NormalizedArticle {
  id: string;
  sourceId: string;
  url: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  language: string;
  normalizedText: string;
}

export type ExtractedEntityType =
  | "country"
  | "person"
  | "organization"
  | "company"
  | "location"
  | "commodity"
  | "currency";

export interface ExtractedEntity {
  name: string;
  type: ExtractedEntityType;
  confidence: number;
}

export interface ArticleClassification {
  sectors: Sector[];
  keywords: string[];
  entities: ExtractedEntity[];
}

export interface StoryMatch {
  storyId: string | null;
  confidence: number;
  reason: string;
}

export type ProcessingStatus =
  | "matched"
  | "new_story"
  | "review_required";

export interface ProcessingResult {
  article: NormalizedArticle;
  classification: ArticleClassification;
  match: StoryMatch;
  status: ProcessingStatus;
  engineVersion: string;
}

export interface IntelligenceContext {
  stories: Story[];
}

/* ── Revisión editorial ── */

export type ReviewDecision =
  | "pending"
  | "approved"
  | "rejected";

/*
 * Lo que la API de revisión devuelve por artículo.
 */
export interface ReviewItem {
  articleId: string;
  sourceId: string;
  sourceName: string;
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  language: string;

  sectors: Sector[];
  keywords: string[];
  entities: ExtractedEntity[];

  status: ProcessingStatus;
  matchStoryId: string | null;
  matchConfidence: number;
  matchReason: string;

  decision: ReviewDecision;
  approvedStoryId: string | null;
  reviewedAt: string | null;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
