import type {
  RawArticle,
} from "../types/intelligence.types";

export const intelligenceFixtures: RawArticle[] = [
  {
    id: "raw-001",
    sourceId: "test-source-a",
    url: "https://example.com/test-001",
    title:
      "Mercados energéticos bajo presión en el estrecho de Ormuz",
    description:
      "Las tensiones en Irán generan preocupación por el petróleo y el comercio energético.",
    publishedAt: "2026-09-29T17:00:00Z",
    receivedAt: "2026-09-29T17:05:00Z",
    language: "es",
  },

  {
    id: "raw-002",
    sourceId: "test-source-b",
    url: "https://example.com/test-002",
    title:
      "El estrecho de Ormuz concentra la atención de los mercados energéticos",
    description:
      "Los inversionistas siguen las tensiones geopolíticas en una ruta estratégica para el petróleo.",
    publishedAt: "2026-09-29T17:15:00Z",
    receivedAt: "2026-09-29T17:20:00Z",
    language: "es",
  },

  {
    id: "raw-003",
    sourceId: "test-source-c",
    url: "https://example.com/test-003",
    title:
      "Presión sobre el petróleo y los mercados por tensiones en Ormuz",
    description:
      "La situación energética en el estrecho de Ormuz mantiene la atención internacional.",
    publishedAt: "2026-09-29T18:00:00Z",
    receivedAt: "2026-09-29T18:05:00Z",
    language: "es",
  },
];