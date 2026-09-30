import type { GlobalEvent } from "../types/event.types";

export const mockEvents: GlobalEvent[] = [
  {
    id: "event-1",

    title:
      "Europa redefine su estrategia comercial",

    summary:
      "Nuevas medidas económicas modifican las relaciones comerciales con sus principales socios.",

    region: "Europa",

    category: "economy",
    importance: "international",
    relevance: "high",

    latitude: 50.85,
    longitude: 4.35,

    countryCodes: [
      "DE",
      "FR",
      "BE",
      "IT",
    ],

    startedAt: "2026-09-28T09:00:00",

    articleIds: [
      "article-2",
    ],

    sourceIds: [],
  },

  {
    id: "event-2",

    title:
      "Mercados energéticos bajo presión",

    summary:
      "La incertidumbre regional vuelve a introducir volatilidad en petróleo y gas.",

    region: "Medio Oriente",

    category: "energy",
    importance: "international",
    relevance: "high",

    latitude: 29.3,
    longitude: 47.5,

    countryCodes: [
      "SA",
      "AE",
      "QA",
      "KW",
    ],

    startedAt: "2026-09-29T07:30:00",

    articleIds: [
      "article-4",
    ],

    sourceIds: [],
  },

  {
    id: "event-3",

    title:
      "La competencia por semiconductores se intensifica",

    summary:
      "Gobiernos y empresas aceleran inversiones estratégicas en infraestructura tecnológica.",

    region: "Asia-Pacífico",

    category: "technology",
    importance: "international",
    relevance: "medium",

    latitude: 25.03,
    longitude: 121.56,

    countryCodes: [
      "TW",
      "JP",
      "KR",
    ],

    startedAt: "2026-09-27T16:00:00",

    articleIds: [
      "article-3",
    ],

    sourceIds: [],
  },
];