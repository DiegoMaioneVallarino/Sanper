export type Sector =
  | "geopolitics"
  | "economy"
  | "markets"
  | "technology"
  | "energy"
  | "science"
  | "business";

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

export interface Story {
  id: string;

  title: string;
  summary: string;

  sectors: Sector[];

  territories: StoryTerritory[];

  location?: GeoLocation;

  importance: StoryImportance;
  relevance: StoryRelevance;

  startedAt: string;
  updatedAt: string;

  articleIds: string[];
  sourceIds: string[];

  countries: StoryCountryRelation[];
}


export type StoryCountryRole =
  | "involved"
  | "affected";

export interface StoryCountryRelation {
  countryCode: string;
  role: StoryCountryRole;
}