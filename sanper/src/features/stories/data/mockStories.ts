import type {
  Story,
} from "../types/story.types";

export const mockStories: Story[] = [
  {
    id: "hormuz-energy-pressure",

    title:
      "Mercados energéticos bajo presión en el Estrecho de Ormuz",

    summary:
      "La actividad en una de las principales rutas energéticas del mundo genera atención geopolítica y financiera.",

    sectors: [
      "energy",
      "geopolitics",
      "markets",
    ],

    territories: [
      {
        code: "IR",
        name: "Irán",
      },
      {
        code: "OM",
        name: "Omán",
      },
    ],

    location: {
      name: "Estrecho de Ormuz",
      latitude: 26.56,
      longitude: 56.25,
    },

    importance: "international",
    relevance: "high",

    startedAt: "2026-09-29T08:00:00Z",
    updatedAt: "2026-09-29T16:00:00Z",

    articleIds: [
      "hormuz-analysis",
    ],

    sourceIds: [],
  },

  {
    id: "taiwan-technology",

    title:
      "Nueva actividad tecnológica en Taiwán",

    summary:
      "El sector tecnológico taiwanés concentra nueva actividad industrial y estratégica.",

    sectors: [
      "technology",
      "business",
      "geopolitics",
    ],

    territories: [
      {
        code: "TW",
        name: "Taiwán",
      },
    ],

    location: {
      name: "Taiwán",
      latitude: 23.6978,
      longitude: 120.9605,
    },

    importance: "international",
    relevance: "medium",

    startedAt: "2026-09-28T10:00:00Z",
    updatedAt: "2026-09-29T12:00:00Z",

    articleIds: [],
    sourceIds: [],
  },

  {
    id: "europe-economic-coordination",

    title:
      "Europa discute nuevas medidas de coordinación económica",

    summary:
      "Representantes europeos mantienen conversaciones sobre coordinación económica regional.",

    sectors: [
      "economy",
      "geopolitics",
    ],

    territories: [
      {
        code: "BE",
        name: "Bélgica",
      },
    ],

    location: {
      name: "Bruselas, Bélgica",
      latitude: 50.8503,
      longitude: 4.3517,
    },

    importance: "regional",
    relevance: "monitoring",

    startedAt: "2026-09-29T09:00:00Z",
    updatedAt: "2026-09-29T14:00:00Z",

    articleIds: [],
    sourceIds: [],
  },
];