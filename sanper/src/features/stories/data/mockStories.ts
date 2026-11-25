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
countries: [
  {
    countryCode: "IR",
    role: "involved",
  },
  {
    countryCode: "US",
    role: "involved",
  },
  {
    countryCode: "OM",
    role: "involved",
  },

  {
    countryCode: "IN",
    role: "affected",
  },
  {
    countryCode: "CN",
    role: "affected",
  },
  {
    countryCode: "JP",
    role: "affected",
  },
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
countries: [
  {
    countryCode: "TW",
    role: "involved",
  },
  {
    countryCode: "CN",
    role: "involved",
  },

  {
    countryCode: "JP",
    role: "affected",
  },
  {
    countryCode: "KR",
    role: "affected",
  },
  {
    countryCode: "US",
    role: "affected",
  },
],
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
countries: [
  {
    countryCode: "BE",
    role: "involved",
  },
  {
    countryCode: "DE",
    role: "involved",
  },
  {
    countryCode: "FR",
    role: "involved",
  },

  {
    countryCode: "ES",
    role: "affected",
  },
  {
    countryCode: "IT",
    role: "affected",
  },
  {
    countryCode: "PL",
    role: "affected",
  },
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

  /*
   * ── DEMOSTRACIÓN ──────────────────────────────────────
   * Acontecimientos ficticios para probar el mapa y la
   * línea de tiempo mientras no hay historias reales en la
   * base. No describen hechos verificados: borrar antes de
   * publicar.
   */

  {
    id: "demo-us-mx-tariffs",
    title: "Aranceles de EE. UU. presionan al peso mexicano",
    summary:
      "Un anuncio arancelario sobre exportaciones mexicanas pone atención en el tipo de cambio y en las cadenas automotrices.",
    sectors: ["economy", "markets", "geopolitics"],
    countries: [
      { countryCode: "US", role: "involved" },
      { countryCode: "MX", role: "involved" },
      { countryCode: "CA", role: "affected" },
    ],
    territories: [
      { code: "MX", name: "México" },
      { code: "US", name: "Estados Unidos" },
    ],
    location: {
      name: "Ciudad de México",
      latitude: 19.4326,
      longitude: -99.1332,
    },
    importance: "international",
    relevance: "high",
    startedAt: "2026-10-14T15:00:00Z",
    updatedAt: "2026-10-22T18:00:00Z",
    articleIds: [],
    sourceIds: [],
  },

  {
    id: "demo-chip-export-controls",
    title: "Nuevos controles a la exportación de chips avanzados",
    summary:
      "Restricciones sobre semiconductores de alto rendimiento afectan a fabricantes en Asia y a sus clientes.",
    sectors: ["technology", "geopolitics", "markets"],
    countries: [
      { countryCode: "US", role: "involved" },
      { countryCode: "CN", role: "involved" },
      { countryCode: "TW", role: "affected" },
      { countryCode: "KR", role: "affected" },
      { countryCode: "NL", role: "affected" },
    ],
    territories: [{ code: "US", name: "Estados Unidos" }],
    location: {
      name: "Washington D. C.",
      latitude: 38.9072,
      longitude: -77.0369,
    },
    importance: "global",
    relevance: "medium",
    startedAt: "2026-10-21T14:00:00Z",
    updatedAt: "2026-11-02T12:00:00Z",
    articleIds: [],
    sourceIds: [],
  },

  {
    id: "demo-red-sea-shipping",
    title: "Desvío de rutas marítimas en el Mar Rojo",
    summary:
      "Navieras evalúan rodear África, con efecto en fletes, seguros y tiempos de entrega hacia Europa.",
    sectors: ["energy", "markets", "geopolitics"],
    countries: [
      { countryCode: "YE", role: "involved" },
      { countryCode: "EG", role: "affected" },
      { countryCode: "SA", role: "affected" },
      { countryCode: "DE", role: "affected" },
    ],
    territories: [{ code: "YE", name: "Yemen" }],
    location: {
      name: "Mar Rojo",
      latitude: 16.5,
      longitude: 41.0,
    },
    importance: "international",
    relevance: "high",
    startedAt: "2026-11-03T09:00:00Z",
    updatedAt: "2026-11-15T10:00:00Z",
    articleIds: [],
    sourceIds: [],
  },

  {
    id: "demo-south-china-sea",
    title: "Tensiones marítimas en el Mar de China Meridional",
    summary:
      "Incidentes entre embarcaciones elevan la atención diplomática en la región.",
    sectors: ["geopolitics"],
    countries: [
      { countryCode: "CN", role: "involved" },
      { countryCode: "PH", role: "involved" },
      { countryCode: "VN", role: "affected" },
    ],
    territories: [{ code: "PH", name: "Filipinas" }],
    location: {
      name: "Mar de China Meridional",
      latitude: 12.0,
      longitude: 114.5,
    },
    importance: "regional",
    relevance: "monitoring",
    startedAt: "2026-11-06T03:00:00Z",
    updatedAt: "2026-11-09T03:00:00Z",
    articleIds: [],
    sourceIds: [],
  },

  {
    id: "demo-opec-output",
    title: "OPEP+ revisa su política de producción",
    summary:
      "La reunión del grupo se sigue de cerca por su efecto en el precio del crudo.",
    sectors: ["energy", "markets"],
    countries: [
      { countryCode: "SA", role: "involved" },
      { countryCode: "RU", role: "involved" },
      { countryCode: "AE", role: "involved" },
      { countryCode: "IN", role: "affected" },
    ],
    territories: [{ code: "AT", name: "Austria" }],
    location: {
      name: "Viena",
      latitude: 48.2082,
      longitude: 16.3738,
    },
    importance: "global",
    relevance: "medium",
    startedAt: "2026-11-12T10:00:00Z",
    updatedAt: "2026-11-13T16:00:00Z",
    articleIds: [],
    sourceIds: [],
  },

  {
    id: "demo-banxico-fx",
    title: "Banxico ajusta su postura ante la volatilidad cambiaria",
    summary:
      "El banco central comunica su lectura del tipo de cambio y de la inflación tras semanas de presión comercial.",
    sectors: ["economy", "markets"],
    countries: [
      { countryCode: "MX", role: "involved" },
    ],
    territories: [{ code: "MX", name: "México" }],
    location: {
      name: "Ciudad de México",
      latitude: 19.4326,
      longitude: -99.1332,
    },
    importance: "national",
    relevance: "monitoring",
    startedAt: "2026-11-19T19:00:00Z",
    updatedAt: "2026-11-20T15:00:00Z",
    articleIds: [],
    sourceIds: [],
  },
];