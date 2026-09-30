import type {
  GlobalEvent,
} from "../../types/event.types";

import "./WorldMap.css";

interface WorldMapProps {
  events: GlobalEvent[];
}

export function WorldMap({
  events,
}: WorldMapProps) {
  return (
    <div className="world-map">
      <div className="world-map__canvas">
        <img
          className="world-map__image"
          src="/maps/world.svg"
          alt=""
          aria-hidden="true"
        />

        <div className="world-map__events">
          {events.map((event) => {
            const position =
              coordinatesToPercent(
                event.location.latitude,
                event.location.longitude,
              );

            return (
              <button
                key={event.id}
                className={`
                  world-map__marker
                  world-map__marker--${event.relevance}
                `}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                type="button"
                aria-label={`${event.title} — ${event.location.name}`}
              >
                <span
                  className="world-map__marker-core"
                />

                <span
                  className="world-map__marker-ring"
                />

                <span
                  className="
                    world-map__marker-ring
                    world-map__marker-ring--delayed
                  "
                />

                <span className="world-map__tooltip">
                  <span className="world-map__tooltip-region">
                    {event.region}
                  </span>

                  <strong>
                    {event.title}
                  </strong>

                  <span className="world-map__tooltip-location">
                    {event.location.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/*
 * Transformación calibrada específicamente
 * para public/maps/world.svg.
 *
 * Calculada a partir de puntos de referencia
 * distribuidos por el mapa:
 *
 * Ciudad de México
 * Quito
 * Londres
 * Ciudad del Cabo
 * Singapur
 * Tokio
 */
function coordinatesToPercent(
  latitude: number,
  longitude: number,
) {
  const x =
    0.27765693 * longitude +
    46.1884822;

  const y =
    -0.50286929 * latitude +
    49.17388057;

  return {
    x,
    y,
  };
}