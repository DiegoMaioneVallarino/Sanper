import type {
  ExtractedEntity,
} from "../types/intelligence.types";

import { normalizeText } from "./normalizeArticle";

type EntityDefinition = {
  name: string;
  type: ExtractedEntity["type"];
  aliases: string[];
};

const entityDictionary: EntityDefinition[] = [
  {
    name: "Irán",
    type: "country",
    aliases: ["iran", "irani", "iranies"],
  },
  {
    name: "Omán",
    type: "country",
    aliases: ["oman"],
  },
  {
    name: "Venezuela",
    type: "country",
    aliases: ["venezuela", "venezolano", "venezolana"],
  },
  {
    name: "Estados Unidos",
    type: "country",
    aliases: ["estados unidos", "ee uu", "usa", "united states"],
  },
  {
    name: "China",
    type: "country",
    aliases: ["china", "chino", "china continental"],
  },
  {
    name: "Taiwán",
    type: "country",
    aliases: ["taiwan", "taiwanes"],
  },
  {
    name: "Japón",
    type: "country",
    aliases: ["japon", "japones"],
  },
  {
    name: "Alemania",
    type: "country",
    aliases: ["alemania", "germania", "germany"],
  },
  {
    name: "Francia",
    type: "country",
    aliases: ["francia", "france"],
  },
  {
    name: "Bélgica",
    type: "country",
    aliases: ["belgica", "belgium"],
  },
  {
    name: "Estrecho de Ormuz",
    type: "location",
    aliases: ["estrecho de ormuz", "ormuz", "hormuz"],
  },
  {
    name: "Bruselas",
    type: "location",
    aliases: ["bruselas", "brussels"],
  },
  {
    name: "OPEP",
    type: "organization",
    aliases: ["opep", "opec"],
  },
  {
    name: "Unión Europea",
    type: "organization",
    aliases: ["union europea", "ue", "european union"],
  },
  {
    name: "TSMC",
    type: "company",
    aliases: ["tsmc", "taiwan semiconductor"],
  },
  {
    name: "Petróleo",
    type: "commodity",
    aliases: ["petroleo", "crudo", "oil"],
  },
  {
    name: "Gas natural",
    type: "commodity",
    aliases: ["gas natural", "lng", "gnl"],
  },
  {
    name: "Semiconductores",
    type: "commodity",
    aliases: ["semiconductores", "chips"],
  },
];

function containsAlias(
  normalizedText: string,
  alias: string,
): boolean {
  const normalizedAlias = normalizeText(alias);

  return ` ${normalizedText} `.includes(
    ` ${normalizedAlias} `,
  );
}

export function extractEntities(
  text: string,
): ExtractedEntity[] {
  const normalized = normalizeText(text);

  const entities: ExtractedEntity[] = [];

  for (const definition of entityDictionary) {
    const matched = definition.aliases.some((alias) =>
      containsAlias(normalized, alias),
    );

    if (matched) {
      entities.push({
        name: definition.name,
        type: definition.type,
        confidence: 1,
      });
    }
  }

  return entities;
}