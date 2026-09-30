import type {
  Sector,
} from "../../types/story.types";

import "./SectorIcon.css";

interface SectorIconProps {
  sector: Sector;
  size?: number;
}

export function SectorIcon({
  sector,
  size = 18,
}: SectorIconProps) {
  return (
    <span
      className={`
        sector-icon
        sector-icon--${sector}
      `}
      style={{
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      <SectorSymbol sector={sector} />
    </span>
  );
}

function SectorSymbol({
  sector,
}: {
  sector: Sector;
}) {
  switch (sector) {
    case "geopolitics":
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
          <path d="M12 4c3 3 3 13 0 16" />
          <path d="M12 4c-3 3-3 13 0 16" />
        </svg>
      );

    case "economy":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 18V10" />
          <path d="M10 18V6" />
          <path d="M15 18v-5" />
          <path d="M20 18V3" />
          <path d="M3 18h19" />
        </svg>
      );

    case "markets":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3 17l5-5 4 3 8-9" />
          <path d="M15 6h5v5" />
        </svg>
      );

    case "technology":
      return (
        <svg viewBox="0 0 24 24">
          <rect
            x="7"
            y="7"
            width="10"
            height="10"
            rx="1"
          />

          <path d="M9 2v5" />
          <path d="M15 2v5" />
          <path d="M9 17v5" />
          <path d="M15 17v5" />
          <path d="M2 9h5" />
          <path d="M2 15h5" />
          <path d="M17 9h5" />
          <path d="M17 15h5" />
        </svg>
      );

    case "energy":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M13 2L6 13h5l-1 9 8-12h-5z" />
        </svg>
      );

    case "science":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M9 3h6" />
          <path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
          <path d="M8 15h8" />
        </svg>
      );

    case "business":
      return (
        <svg viewBox="0 0 24 24">
          <rect
            x="3"
            y="7"
            width="18"
            height="13"
            rx="2"
          />

          <path d="M9 7V4h6v3" />
          <path d="M3 12h18" />
        </svg>
      );
  }
}