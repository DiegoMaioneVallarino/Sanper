import type {
  GlobalEvent,
} from "../types/event.types";

export const mockEvents: GlobalEvent[] = [
  {
    id: "event-1",

    title:
      "Europa redefine su estrategia comercial",

    summary:
      "Nuevas medidas económicas modifican las relaciones comerciales con sus principales socios.",

    region: "Europa",

    location: {
      name: "Bruselas, Bélgica",
      latitude: 50.8503,
      longitude: 4.3517,
    },

    category: "economy",
    importance: "international",
    relevance: "high",

    countryCodes: [
      "BE",
      "DE",
      "FR",
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
      "La incertidumbre sobre el tránsito marítimo vuelve a introducir volatilidad en petróleo y gas.",

    region: "Medio Oriente",

    location: {
      name: "Estrecho de Ormuz",
      latitude: 26.56,
      longitude: 56.25,
    },

    category: "energy",
    importance: "international",
    relevance: "high",

    countryCodes: [
      "IR",
      "OM",
      "AE",
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

    location: {
      name: "Taiwán",
      latitude: 23.6978,
      longitude: 120.9605,
    },

    category: "technology",
    importance: "international",
    relevance: "medium",

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