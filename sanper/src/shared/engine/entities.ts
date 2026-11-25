import type {
  ExtractedEntity,
} from "../domain";

import {
  normalizeText,
  containsPhrase,
} from "./normalize";

type EntityDefinition = {
  name: string;
  type: ExtractedEntity["type"];
  aliases: string[];
};

/*
 * Diccionario provisional, bilingüe, centrado en las tres
 * cadenas del MVP (Golfo Pérsico, Taiwán/chips, EE. UU.–México).
 *
 * En la fase 2 esta lista se carga de la tabla `entities`
 * y en la fase 1 el extractor LLM detecta el resto.
 */
const entityDictionary: EntityDefinition[] = [
  // Países
  { name: "Irán", type: "country", aliases: ["iran", "irani", "iranies", "iranian", "tehran", "teheran"] },
  { name: "Omán", type: "country", aliases: ["oman"] },
  { name: "Arabia Saudita", type: "country", aliases: ["arabia saudita", "arabia saudi", "saudi arabia", "riad", "riyadh"] },
  { name: "Israel", type: "country", aliases: ["israel", "israeli", "israelies"] },
  { name: "Rusia", type: "country", aliases: ["rusia", "russia", "russian", "ruso", "rusa", "kremlin"] },
  { name: "Ucrania", type: "country", aliases: ["ucrania", "ukraine", "ukrainian", "ucraniano"] },
  { name: "Venezuela", type: "country", aliases: ["venezuela", "venezolano", "venezolana", "venezuelan"] },
  { name: "Estados Unidos", type: "country", aliases: ["estados unidos", "ee uu", "eeuu", "usa", "united states", "u s", "estadounidense"] },
  { name: "México", type: "country", aliases: ["mexico", "mexicano", "mexicana", "mexican"] },
  { name: "Canadá", type: "country", aliases: ["canada", "canadian", "canadiense"] },
  { name: "China", type: "country", aliases: ["china", "chino", "china continental", "chinese", "beijing", "pekin"] },
  { name: "Taiwán", type: "country", aliases: ["taiwan", "taiwanes", "taiwanese", "taipei"] },
  { name: "Japón", type: "country", aliases: ["japon", "japones", "japan", "japanese"] },
  { name: "Corea del Sur", type: "country", aliases: ["corea del sur", "south korea", "surcoreano"] },
  { name: "India", type: "country", aliases: ["india", "indian"] },
  { name: "Alemania", type: "country", aliases: ["alemania", "germany", "german", "aleman"] },
  { name: "Francia", type: "country", aliases: ["francia", "france", "french", "frances"] },
  { name: "Bélgica", type: "country", aliases: ["belgica", "belgium"] },
  { name: "Reino Unido", type: "country", aliases: ["reino unido", "united kingdom", "uk", "britain", "british", "britanico"] },

  // Lugares estratégicos
  { name: "Estrecho de Ormuz", type: "location", aliases: ["estrecho de ormuz", "ormuz", "hormuz", "strait of hormuz"] },
  { name: "Mar Rojo", type: "location", aliases: ["mar rojo", "red sea"] },
  { name: "Estrecho de Taiwán", type: "location", aliases: ["estrecho de taiwan", "taiwan strait"] },
  { name: "Bruselas", type: "location", aliases: ["bruselas", "brussels"] },

  // Organizaciones
  { name: "OPEP", type: "organization", aliases: ["opep", "opec", "opep+", "opec+"] },
  { name: "Unión Europea", type: "organization", aliases: ["union europea", "european union", "eu"] },
  { name: "OTAN", type: "organization", aliases: ["otan", "nato"] },
  { name: "Reserva Federal", type: "organization", aliases: ["reserva federal", "federal reserve", "the fed"] },
  { name: "Banxico", type: "organization", aliases: ["banxico", "banco de mexico"] },
  { name: "T-MEC", type: "organization", aliases: ["t mec", "tmec", "usmca", "cusma"] },

  // Empresas
  { name: "TSMC", type: "company", aliases: ["tsmc", "taiwan semiconductor"] },
  { name: "Pemex", type: "company", aliases: ["pemex", "petroleos mexicanos"] },
  { name: "Nvidia", type: "company", aliases: ["nvidia"] },

  // Mercancías y divisas
  { name: "Petróleo", type: "commodity", aliases: ["petroleo", "crudo", "oil", "crude", "brent", "wti"] },
  { name: "Gas natural", type: "commodity", aliases: ["gas natural", "natural gas", "lng", "gnl"] },
  { name: "Semiconductores", type: "commodity", aliases: ["semiconductores", "semiconductor", "semiconductors", "chips"] },
  { name: "Oro", type: "commodity", aliases: ["oro", "gold"] },
  { name: "Peso mexicano", type: "currency", aliases: ["peso mexicano", "mexican peso", "usd mxn", "usdmxn"] },
  { name: "Dólar estadounidense", type: "currency", aliases: ["dolar", "dollar", "greenback"] },
];

const normalizedDictionary = entityDictionary.map(
  (definition) => ({
    ...definition,
    aliases: definition.aliases.map(normalizeText),
  }),
);

/*
 * Acepta texto crudo o ya normalizado
 * (normalizeText es idempotente).
 */
export function extractEntities(
  text: string,
): ExtractedEntity[] {
  const normalized = normalizeText(text);

  return normalizedDictionary
    .filter((definition) =>
      definition.aliases.some((alias) =>
        containsPhrase(normalized, alias),
      ),
    )
    .map((definition) => ({
      name: definition.name,
      type: definition.type,
      confidence: 1,
    }));
}
