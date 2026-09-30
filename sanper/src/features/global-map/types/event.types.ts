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

export interface EventLocation {
  name: string;

  latitude: number;
  longitude: number;
}

export interface GlobalEvent {
  id: string;

  title: string;
  summary: string;

  region: string;

  location: EventLocation;

  category: EventCategory;
  importance: EventImportance;
  relevance: EventRelevance;

  countryCodes: string[];

  startedAt: string;
  endedAt?: string;

  articleIds: string[];
  sourceIds: string[];
}