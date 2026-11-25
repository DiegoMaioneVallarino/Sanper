import type { Sector } from "./sectors";

export type StoryImportance =
  | "local"
  | "national"
  | "regional"
  | "international"
  | "global";

export type StoryRelevance =
  | "high"
  | "medium"
  | "monitoring";

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface StoryTerritory {
  code: string;
  name: string;
}

export type StoryCountryRole =
  | "involved"
  | "affected";

export interface StoryCountryRelation {
  countryCode: string;
  role: StoryCountryRole;
}

/*
 * Story = un acontecimiento real que agrupa
 * artículos de varias fuentes.
 */
export interface Story {
  id: string;

  title: string;
  summary: string;

  sectors: Sector[];

  territories: StoryTerritory[];
  countries: StoryCountryRelation[];

  location?: GeoLocation;

  importance: StoryImportance;
  relevance: StoryRelevance;

  startedAt: string;
  updatedAt: string;

  articleIds: string[];
  sourceIds: string[];
}
