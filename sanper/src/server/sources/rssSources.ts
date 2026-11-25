/*
 * Fuentes iniciales. `npm run db:seed` las inserta en la
 * tabla `sources`; a partir de ahí se administran en la base.
 *
 * verified: la URL respondió como RSS válido al revisarla
 * (24 nov 2026). Las no verificadas se activan igual: si
 * fallan, la ingesta lo registra en sources.last_error y sigue.
 */
export interface SourceSeed {
  id: string;
  name: string;
  url: string;
  kind: "rss" | "official";
  language: "es" | "en";
  reliability: number;
  enabled: boolean;
  verified: boolean;
}

export const sourceSeeds: SourceSeed[] = [
  {
    id: "bbc-world",
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    kind: "rss",
    language: "en",
    reliability: 0.85,
    enabled: true,
    verified: false,
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    kind: "rss",
    language: "en",
    reliability: 0.75,
    enabled: true,
    verified: true,
  },
  {
    id: "fed-press",
    name: "Federal Reserve · Comunicados",
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    kind: "official",
    language: "en",
    reliability: 0.95,
    enabled: true,
    verified: true,
  },
  {
    id: "bbc-mundo",
    name: "BBC Mundo",
    url: "https://feeds.bbci.co.uk/mundo/rss.xml",
    kind: "rss",
    language: "es",
    reliability: 0.85,
    enabled: true,
    verified: false,
  },
  {
    id: "elpais-economia",
    name: "El País · Economía",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/economia/portada",
    kind: "rss",
    language: "es",
    reliability: 0.8,
    enabled: true,
    verified: false,
  },
  {
    id: "dw-espanol",
    name: "DW Español",
    url: "https://rss.dw.com/rdf/rss-sp-all",
    kind: "rss",
    language: "es",
    reliability: 0.8,
    enabled: true,
    verified: false,
  },
];
