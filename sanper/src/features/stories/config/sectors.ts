import type {
  Sector,
} from "../types/story.types";

export interface SectorConfig {
  label: string;
  shortLabel: string;
}

export const sectorConfig =
  {
    geopolitics: {
      label: "Geopolítica",
      shortLabel: "Geopolítica",
    },

    economy: {
      label: "Economía",
      shortLabel: "Economía",
    },

    markets: {
      label: "Mercados",
      shortLabel: "Mercados",
    },

    technology: {
      label: "Tecnología",
      shortLabel: "Tecnología",
    },

    energy: {
      label: "Energía",
      shortLabel: "Energía",
    },

    science: {
      label: "Ciencia",
      shortLabel: "Ciencia",
    },

    business: {
      label: "Negocios",
      shortLabel: "Negocios",
    },
  } satisfies Record<
    Sector,
    SectorConfig
  >;