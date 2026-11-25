import type {
  Sector,
  NormalizedArticle,
  ArticleClassification,
} from "../domain";

import {
  normalizeText,
  containsPhrase,
} from "./normalize";

import { extractEntities } from "./entities";

/*
 * Palabras clave por sector, en español e inglés.
 *
 * Es un clasificador provisional: en la fase 1 lo
 * reemplaza la extracción de eventos con un LLM.
 * Se mantiene como respaldo barato y como base de
 * comparación para medir al extractor.
 */
const sectorKeywords: Record<Sector, string[]> = {
  geopolitics: [
    // es
    "conflicto", "guerra", "sanciones", "diplomacia",
    "militar", "otan", "tensiones", "geopolitica",
    "misil", "ataque", "tratado", "frontera", "cumbre",
    "ejercito", "invasion", "alto el fuego",
    // en
    "conflict", "war", "sanctions", "diplomacy",
    "military", "nato", "tensions", "geopolitics",
    "missile", "strike", "treaty", "border", "summit",
    "troops", "invasion", "ceasefire", "export controls",
    "controles de exportacion",
  ],

  economy: [
    "inflacion", "economia", "pib", "recesion",
    "crecimiento economico", "banco central",
    "politica monetaria", "tasa de interes", "aranceles",
    "arancel", "desempleo", "comercio exterior",
    "inflation", "economy", "gdp", "recession",
    "economic growth", "central bank", "monetary policy",
    "interest rate", "interest rates", "tariff", "tariffs",
    "unemployment", "trade deal",
  ],

  markets: [
    "mercados", "bolsa", "acciones", "inversionistas",
    "cotizacion", "futuros", "volatilidad", "bonos",
    "tipo de cambio", "divisas",
    "markets", "stocks", "shares", "investors",
    "futures", "volatility", "bonds", "treasury yields",
    "exchange rate", "currency", "wall street",
  ],

  technology: [
    "tecnologia", "semiconductores", "inteligencia artificial",
    "chips", "software", "procesadores",
    "technology", "semiconductor", "semiconductors",
    "artificial intelligence", "chipmaker", "processors",
  ],

  energy: [
    "petroleo", "gas natural", "energia", "petrolera",
    "ormuz", "opep", "electricidad", "crudo", "refineria",
    "oil", "natural gas", "energy", "hormuz", "opec",
    "electricity", "crude", "refinery", "lng", "brent",
  ],

  science: [
    "investigacion", "cientificos", "descubrimiento",
    "laboratorio", "fisica", "biologia",
    "estudio cientifico",
    "research", "scientists", "discovery", "laboratory",
    "physics", "biology",
  ],

  business: [
    "empresa", "corporacion", "adquisicion", "fusion",
    "negocio", "industria", "fabricante",
    "company", "corporation", "acquisition", "merger",
    "industry", "manufacturer", "earnings",
  ],
};

/* Normalizado una sola vez al cargar el módulo. */
const normalizedSectorKeywords = (
  Object.entries(sectorKeywords) as [Sector, string[]][]
).map(([sector, terms]) => ({
  sector,
  terms: terms.map((term) => ({
    original: term,
    normalized: normalizeText(term),
  })),
}));

export function classifyArticle(
  article: NormalizedArticle,
): ArticleClassification {
  const sectors: Sector[] = [];
  const keywords = new Set<string>();

  for (const { sector, terms } of normalizedSectorKeywords) {
    let matches = 0;

    for (const term of terms) {
      if (
        containsPhrase(
          article.normalizedText,
          term.normalized,
        )
      ) {
        matches++;
        keywords.add(term.original);
      }
    }

    if (matches > 0) {
      sectors.push(sector);
    }
  }

  return {
    sectors,
    keywords: [...keywords],
    entities: extractEntities(article.normalizedText),
  };
}
