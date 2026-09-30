import {
  useEffect,
  useRef,
  useState,
} from "react";

interface HoveredCountry {
  code: string;
  name: string;
  x: number;
  y: number;
}

const countryNames = new Intl.DisplayNames(
  ["es"],
  {
    type: "region",
  },
);

const IGNORED_CLASSES = new Set([
  "land",
  "coast",
  "lake",
  "ocean",
  "circle",
  "aq",
]);

export function InteractiveWorldMap() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [svgContent, setSvgContent] =
    useState("");

  const [hoveredCountry, setHoveredCountry] =
    useState<HoveredCountry | null>(null);

  useEffect(() => {
    fetch("/maps/world.svg")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "No se pudo cargar world.svg",
          );
        }

        return response.text();
      })
      .then(setSvgContent)
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function getCountryCode(
    element: Element,
  ) {
    const classes = Array.from(
      element.classList,
    );

    const code = classes.find(
      (className) =>
        className.length === 2 &&
        !IGNORED_CLASSES.has(className),
    );

    return code?.toUpperCase() ?? null;
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    const target =
      event.target as Element;

    const country =
      target.closest(".land");

    if (!country) {
      setHoveredCountry(null);
      return;
    }

    const code =
      getCountryCode(country);

    if (!code) {
      setHoveredCountry(null);
      return;
    }

    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const rect =
      container.getBoundingClientRect();

    const name =
      countryNames.of(code) ?? code;

    setHoveredCountry({
      code,
      name,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function handlePointerLeave() {
    setHoveredCountry(null);
  }

  return (
    <div
      ref={containerRef}
      className="world-map__interactive"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="world-map__svg"
        dangerouslySetInnerHTML={{
          __html: svgContent,
        }}
      />

      {hoveredCountry && (
        <div
          className="world-map__country-tooltip"
          style={{
            left: hoveredCountry.x,
            top: hoveredCountry.y,
          }}
        >
          {hoveredCountry.name}
        </div>
      )}
    </div>
  );
}