import { useState } from "react";

import type {
  Story,
  Sector,
} from "../../../stories/types/story.types";

import {
  sectorConfig,
} from "../../../stories/config/sectors";

import {
  SectorIcon,
} from "../../../stories/components/SectorIcon/SectorIcon";

import {
  InteractiveWorldMap,
} from "./InteractiveWorldMap";

import type {
  ViewBox,
} from "./InteractiveWorldMap";

import "./WorldMap.css";


import {
  CapitalLightsLayer,
} from "../CapitalLightsLayer/CapitalLightsLayer";

import {
  coordinatesToViewBoxPercent,
} from "../../utils/mapCoordinates";

interface WorldMapProps {
  stories: Story[];
}
type SectorFilter =
  | "all"
  | Sector;

const sectors: Sector[] = [
  "geopolitics",
  "economy",
  "markets",
  "technology",
  "energy",
  "science",
  "business",
];
export function WorldMap({
  stories,
}: WorldMapProps) {
  const [
    activeSector,
    setActiveSector,
  ] = useState<SectorFilter>("all");

  const visibleStories =
    activeSector === "all"
      ? stories
      : stories.filter((story) =>
          story.sectors.includes(
            activeSector,
          ),
        );
const [
  mapViewBox,
  setMapViewBox,
] = useState<ViewBox>({
  x: 0,
  y: 0,
  width: 2752.766,
  height: 1537.631,
});
  return (
  <div className="world-map">
    <div className="world-map__filters">
      <button
        className={`
          world-map__filter
          ${
            activeSector === "all"
              ? "world-map__filter--active"
              : ""
          }
        `}
        type="button"
        onClick={() =>
          setActiveSector("all")
        }
      >
        Todos

        <span className="world-map__filter-count">
          {stories.length}
        </span>
      </button>

      {sectors.map((sector) => {
        const config =
          sectorConfig[sector];

        const isActive =
          activeSector === sector;

        const count =
          stories.filter((story) =>
            story.sectors.includes(sector),
          ).length;

        return (
          <button
            key={sector}
            className={`
              world-map__filter
              ${
                isActive
                  ? "world-map__filter--active"
                  : ""
              }
            `}
            type="button"
            onClick={() =>
              setActiveSector(sector)
            }
          >
            <SectorIcon
              sector={sector}
              size={13}
            />

            {config.label}

            <span className="world-map__filter-count">
              {count}
            </span>
          </button>
        );
      })}
    </div>

    <div className="world-map__canvas">
  <div className="world-map__viewport">
<InteractiveWorldMap
  onViewBoxChange={setMapViewBox}
/>

  <CapitalLightsLayer
    viewBox={mapViewBox}
  />
    <div className="world-map__events">
      {visibleStories.map((story) => {
          if (!story.location) {
            return null;
          }

       const position =
  coordinatesToViewBoxPercent(
    story.location.latitude,
    story.location.longitude,
    mapViewBox,
  );
const isVisible =
  position.x >= 0 &&
  position.x <= 100 &&
  position.y >= 0 &&
  position.y <= 100;

if (!isVisible) {
  return null;
}
return (
            <button
              key={story.id}
              className={`
                world-map__marker
                world-map__marker--${story.relevance}
              `}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              type="button"
              aria-label={
                `${story.title} — ${story.location.name}`
              }
            >
              <span className="world-map__marker-core" />

              <span className="world-map__marker-ring" />

              <span
                className="
                  world-map__marker-ring
                  world-map__marker-ring--delayed
                "
              />

              <span className="world-map__tooltip">
                <span className="world-map__tooltip-region">
                  {story.territories
                    .map(
                      (territory) =>
                        territory.name,
                    )
                    .join(" · ")}
                </span>

                <span className="world-map__tooltip-sectors">
                  {story.sectors.map((sector) => (
                    <SectorIcon
                      key={sector}
                      sector={sector}
                      size={12}
                    />
                  ))}
                </span>

                <strong>
                  {story.title}
                </strong>

                <span className="world-map__tooltip-location">
                  {story.location.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      </div>
    </div>
  </div>
);
}

