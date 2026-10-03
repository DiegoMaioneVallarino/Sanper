import type {
  SavedArticle,
  SavedCollection,
} from "../types/saved.types";

export const mockSavedArticles: SavedArticle[] = [
  {
    articleId: "article-hormuz-001",
    savedAt: "2026-10-03T01:20:00Z",
    collectionId: "collection-global",
  },
  {
    articleId: "article-2",
    savedAt: "2026-10-02T22:10:00Z",
  },
  {
    articleId: "article-3",
    savedAt: "2026-10-01T18:30:00Z",
    collectionId: "collection-markets",
  },
];

export const mockSavedCollections: SavedCollection[] = [
  {
    id: "collection-global",
    name: "Geopolítica",
    description:
      "Historias y análisis sobre acontecimientos internacionales.",
    createdAt: "2026-10-01T12:00:00Z",
  },
  {
    id: "collection-markets",
    name: "Mercados",
    description:
      "Análisis económicos y movimientos relevantes.",
    createdAt: "2026-10-02T12:00:00Z",
  },
];