export type IntelligenceSector =
  | "geopolitics"
  | "economy"
  | "markets"
  | "technology"
  | "energy"
  | "science"
  | "business";

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
  normalizedText: string;
}

export interface ExtractedEntity {
  name: string;
  type:
    | "country"
    | "person"
    | "organization"
    | "company"
    | "location"
    | "commodity";
  confidence: number;
}

export interface ArticleClassification {
  sectors: IntelligenceSector[];
  keywords: string[];
  entities: ExtractedEntity[];
}

export interface StoryMatch {
  storyId: string | null;
  confidence: number;
  reason: string;
}

export interface ProcessingResult {
  article: NormalizedArticle;
  classification: ArticleClassification;
  match: StoryMatch;
  status: "matched" | "new_story" | "review_required";
}import type {
  Story,
} from "../../stories/types/story.types";

export interface IntelligenceContext {
  stories: Story[];
}