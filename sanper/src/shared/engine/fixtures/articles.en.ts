import type { RawArticle } from "../../domain";

/*
 * Titulares en inglés con la forma de los feeds reales.
 * Sirven para comprobar que el motor ya no ignora
 * las fuentes en inglés.
 */
export const englishFixtures: RawArticle[] = [
  {
    id: "en-001",
    sourceId: "fixture-en",
    url: "https://example.com/en-001",
    title: "Oil prices jump as tensions rise in the Strait of Hormuz",
    description: "Brent crude climbed after Iran warned tankers, raising concern among investors about energy supply.",
    publishedAt: "2026-09-29T19:00:00Z",
    receivedAt: "2026-09-29T19:05:00Z",
    language: "en",
  },
  {
    id: "en-002",
    sourceId: "fixture-en",
    url: "https://example.com/en-002",
    title: "US weighs new export controls on advanced chips to China",
    description: "The measures would hit semiconductor makers including TSMC and Nvidia, analysts said.",
    publishedAt: "2026-09-29T20:00:00Z",
    receivedAt: "2026-09-29T20:05:00Z",
    language: "en",
  },
  {
    id: "en-003",
    sourceId: "fixture-en",
    url: "https://example.com/en-003",
    title: "Mexican peso slides after Washington announces new tariffs",
    description: "The tariffs on Mexico could strain the USMCA trade deal; Banxico said it is monitoring the exchange rate.",
    publishedAt: "2026-09-29T21:00:00Z",
    receivedAt: "2026-09-29T21:05:00Z",
    language: "en",
  },
];
