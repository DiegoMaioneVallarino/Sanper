export type EventCategory =
  | "geopolitics"
  | "economy"
  | "markets"
  | "energy"
  | "technology"
  | "conflict"
  | "diplomacy";

export type EventImportance =
  | "local"
  | "national"
  | "regional"
  | "international";

export type EventRelevance =
  | "high"
  | "medium"
  | "monitoring";

export interface GlobalEvent {
  id: string;

  title: string;
  summary: string;

  region: string;

  category: EventCategory;
  importance: EventImportance;
  relevance: EventRelevance;

  latitude: number;
  longitude: number;

  countryCodes: string[];

  startedAt: string;
  endedAt?: string;

  articleIds: string[];
  sourceIds: string[];
}