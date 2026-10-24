import type {
  Sector,
} from "../../stories/types/story.types";

import type {
  NormalizedArticle,
  ArticleClassification,
} from "../types/intelligence.types";

import {
  normalizeText,
} from "./normalizeArticle";

const sectorKeywords: Record<Sector, string[]> = {
  geopolitics: [
    "iran",
    "conflicto",
    "guerra",
    "sanciones",
    "diplomacia",
    "militar",
    "otan",
    "tensiones",
    "geopolitica",
  ],

  economy: [
    "inflacion",
    "economia",
    "pib",
    "recesion",
    "crecimiento economico",
    "banco central",
    "politica monetaria",
  ],

  markets: [
    "mercados",
    "bolsa",
    "acciones",
    "inversionistas",
    "precio",
    "cotizacion",
    "futuros",
    "volatilidad",
  ],

  technology: [
    "tecnologia",
    "semiconductores",
    "inteligencia artificial",
    "chips",
    "software",
    "procesadores",
    "taiwan",
  ],

  energy: [
    "petroleo",
    "gas natural",
    "energia",
    "petrolera",
    "ormuz",
    "opep",
    "electricidad",
    "crudo",
    "refineria",
  ],

  science: [
    "investigacion",
    "cientificos",
    "descubrimiento",
    "laboratorio",
    "fisica",
    "biologia",
    "estudio cientifico",
  ],

  business: [
    "empresa",
    "corporacion",
    "adquisicion",
    "fusion",
    "negocio",
    "industria",
    "fabricante",
  ],
};

function containsKeyword(
  text: string,
  keyword: string,
): boolean {
  const normalizedKeyword = normalizeText(keyword);

  return (
    ` ${text} `.includes(
      ` ${normalizedKeyword} `,
    )
  );
}

export function classifyArticle(
  article: NormalizedArticle,
): ArticleClassification {
  const sectors: Sector[] = [];
  const keywords = new Set<string>();

  for (const [sector, terms] of Object.entries(
    sectorKeywords,
  ) as [Sector, string[]][]) {
    let matches = 0;

    for (const term of terms) {
      if (containsKeyword(article.normalizedText, term)) {
        matches++;
        keywords.add(term);
      }
    }

    if (matches > 0) {
      sectors.push(sector);
    }
  }

return {
  sectors,
  keywords: [...keywords],
  entities: [],
};
}