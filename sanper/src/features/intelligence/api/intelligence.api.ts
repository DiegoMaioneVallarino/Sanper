import { apiRequest } from "../../../app/api";

import type {
  ReviewDecision,
  ReviewItem,
  ReviewStats,
} from "../../../shared/domain";

export function fetchReviewItems(
  decision: ReviewDecision | "all",
): Promise<{ items: ReviewItem[] }> {
  return apiRequest(
    `/api/review/items?decision=${decision}&limit=200`,
  );
}

export function fetchReviewStats(): Promise<ReviewStats> {
  return apiRequest("/api/review/stats");
}

export function submitDecision(
  articleId: string,
  decision: ReviewDecision,
  storyId?: string,
): Promise<{ ok: true }> {
  return apiRequest(
    `/api/review/items/${encodeURIComponent(articleId)}/decision`,
    {
      method: "POST",
      body: JSON.stringify({ decision, storyId }),
    },
  );
}

export interface IngestionSummary {
  runId: number;
  fetched: number;
  inserted: number;
  duplicates: number;
  failedSources: { sourceId: string; error: string }[];
}

export function triggerIngestion(): Promise<IngestionSummary> {
  return apiRequest("/api/ingestion/run", { method: "POST" });
}
