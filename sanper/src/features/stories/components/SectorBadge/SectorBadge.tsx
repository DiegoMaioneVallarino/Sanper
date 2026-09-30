import type {
  Sector,
} from "../../types/story.types";

import {
  sectorConfig,
} from "../../config/sectors";

import {
  SectorIcon,
} from "../SectorIcon/SectorIcon";

import "./SectorBadge.css";

interface SectorBadgeProps {
  sector: Sector;
}

export function SectorBadge({
  sector,
}: SectorBadgeProps) {
  const config =
    sectorConfig[sector];

  return (
    <span
      className={`
        sector-badge
        sector-badge--${sector}
      `}
    >
      <SectorIcon
        sector={sector}
        size={13}
      />

      <span>
        {config.label}
      </span>
    </span>
  );
}