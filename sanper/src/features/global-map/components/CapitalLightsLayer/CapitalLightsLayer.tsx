import {
  worldCapitals,
} from "../../data/worldCapitals";

import "./CapitalLightsLayer.css";
import {
  coordinatesToViewBoxPercent,
} from "../../utils/mapCoordinates";
interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CapitalLightsLayerProps {
  viewBox: ViewBox;
}



export function CapitalLightsLayer({
  viewBox,
}: CapitalLightsLayerProps) {
  return (
    <div className="capital-lights">
      {worldCapitals.map((capital) => {
       const position =
  coordinatesToViewBoxPercent(
    capital.latitude,
    capital.longitude,
    viewBox,
  );

        /*
         * No renderizamos capitales
         * fuera del viewport actual.
         */
        if (
          position.x < 0 ||
          position.x > 100 ||
          position.y < 0 ||
          position.y > 100
        ) {
          return null;
        }

        return (
          <div
            key={capital.countryCode}
            className="capital-light"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            title={`${capital.city} · ${capital.countryCode}`}
          >
            <span className="capital-light__far" />

            <span className="capital-light__near" />

            <span className="capital-light__core" />
          </div>
        );
      })}
    </div>
  );
}