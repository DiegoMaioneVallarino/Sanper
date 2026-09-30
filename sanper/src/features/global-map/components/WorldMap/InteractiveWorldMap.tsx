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

interface SelectedCountry {
  code: string;
  name: string;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface InteractiveWorldMapProps {
  onViewBoxChange?: (
    viewBox: ViewBox,
  ) => void;
}
const WORLD_VIEWBOX: ViewBox = {
  x: 0,
  y: 0,
  width: 2752.766,
  height: 1537.631,
};

const ZOOM_DURATION = 650;


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

export function InteractiveWorldMap({
  onViewBoxChange,
}: InteractiveWorldMapProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [svgContent, setSvgContent] =
    useState("");

  const [hoveredCountry, setHoveredCountry] =
    useState<HoveredCountry | null>(null);

    const [
    selectedCountry,
    setSelectedCountry,
    ] = useState<SelectedCountry | null>(
    null,
    );

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
      .then((svg) => {
  const modifiedSvg =
    svg.replace(
      "<svg",
      '<svg preserveAspectRatio="none"',
    );

  setSvgContent(modifiedSvg);
})
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

function getCountryBounds(
  elements: SVGGraphicsElement[],
) {
  if (elements.length === 0) {
    return null;
  }

  const boxes =
    elements.map((element) =>
      element.getBBox(),
    );

  const minX =
    Math.min(
      ...boxes.map((box) => box.x),
    );

  const minY =
    Math.min(
      ...boxes.map((box) => box.y),
    );

  const maxX =
    Math.max(
      ...boxes.map(
        (box) =>
          box.x + box.width,
      ),
    );

  const maxY =
    Math.max(
      ...boxes.map(
        (box) =>
          box.y + box.height,
      ),
    );

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}


function createCountryViewBox(
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
): ViewBox {
  const worldRatio =
    WORLD_VIEWBOX.width /
    WORLD_VIEWBOX.height;

  /*
   * Calculamos qué tan grande es el país
   * respecto al mapa mundial.
   */
  const relativeWidth =
    bounds.width /
    WORLD_VIEWBOX.width;

  const relativeHeight =
    bounds.height /
    WORLD_VIEWBOX.height;

  const relativeSize =
    Math.max(
      relativeWidth,
      relativeHeight,
    );

  /*
   * Países pequeños necesitan más contexto.
   * Países grandes necesitan mucho menos padding.
   */
  let paddingFactor: number;

  if (relativeSize > 0.35) {
    // Rusia, Canadá, etc.
    paddingFactor = 0.08;
  } else if (relativeSize > 0.2) {
    // EE.UU., China, Brasil...
    paddingFactor = 0.15;
  } else if (relativeSize > 0.08) {
    // México, Irán, Turquía...
    paddingFactor = 0.3;
  } else {
    // Países pequeños.
    paddingFactor = 0.6;
  }

  let width =
    bounds.width *
    (1 + paddingFactor * 2);

  let height =
    bounds.height *
    (1 + paddingFactor * 2);

  /*
   * Mantenemos el mismo aspect ratio
   * del mapa mundial.
   *
   * Esto evita deformar el mapa
   * durante el zoom.
   */
  const currentRatio =
    width / height;

  if (currentRatio > worldRatio) {
    height =
      width / worldRatio;
  } else {
    width =
      height * worldRatio;
  }

  /*
   * Centro real del país.
   */
  const centerX =
    bounds.x +
    bounds.width / 2;

  const centerY =
    bounds.y +
    bounds.height / 2;

  /*
   * Seguridad:
   * el zoom nunca puede ser mayor
   * que el mundo completo.
   */
  width =
    Math.min(
      width,
      WORLD_VIEWBOX.width,
    );

  height =
    Math.min(
      height,
      WORLD_VIEWBOX.height,
    );

  /*
   * Construimos el nuevo viewport
   * centrado en el país.
   */
  let x =
    centerX -
    width / 2;

  let y =
    centerY -
    height / 2;

  /*
   * Evitamos sacar el viewport
   * fuera del SVG mundial.
   */
  x =
    Math.max(
      WORLD_VIEWBOX.x,
      Math.min(
        x,
        WORLD_VIEWBOX.x +
          WORLD_VIEWBOX.width -
          width,
      ),
    );

  y =
    Math.max(
      WORLD_VIEWBOX.y,
      Math.min(
        y,
        WORLD_VIEWBOX.y +
          WORLD_VIEWBOX.height -
          height,
      ),
    );

  return {
    x,
    y,
    width,
    height,
  };
}

function animateViewBox(
  svg: SVGSVGElement,
  from: ViewBox,
  to: ViewBox,
  duration = ZOOM_DURATION,
) {
  const startTime =
    performance.now();

  function frame(
    currentTime: number,
  ) {
    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1,
      );

    // easeInOutCubic
    const eased =
      progress < 0.5
        ? 4 *
          progress *
          progress *
          progress
        : 1 -
          Math.pow(
            -2 * progress + 2,
            3,
          ) /
            2;

    const current = {
      x:
        from.x +
        (to.x - from.x) *
          eased,

      y:
        from.y +
        (to.y - from.y) *
          eased,

      width:
        from.width +
        (to.width - from.width) *
          eased,

      height:
        from.height +
        (to.height - from.height) *
          eased,
    };

    svg.setAttribute(
      "viewBox",
      `${current.x} ${current.y} ${current.width} ${current.height}`,
    );
onViewBoxChange?.(current);
    if (progress < 1) {
      requestAnimationFrame(
        frame,
      );
    }
  }

  requestAnimationFrame(frame);
}

function getCurrentViewBox(
  svg: SVGSVGElement,
): ViewBox {
  const viewBox =
    svg.viewBox.baseVal;

  return {
    x: viewBox.x,
    y: viewBox.y,
    width: viewBox.width,
    height: viewBox.height,
  };
}
function getCountryBoundsForZoom(
  element: SVGGraphicsElement,
): ViewBox {
  const bbox =
    element.getBBox();

  /*
   * SVGGraphicsElement.transform.baseVal
   * contiene solamente los transforms
   * declarados sobre el elemento.
   *
   * Esto es exactamente lo que necesitamos
   * para el caso extraño de Sudán.
   */
  const transformList =
    element.transform.baseVal;

  if (
    !transformList ||
    transformList.numberOfItems === 0
  ) {
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    };
  }

  const matrix =
    transformList.consolidate()?.matrix;

  if (!matrix) {
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    };
  }

  const corners = [
    new DOMPoint(
      bbox.x,
      bbox.y,
    ),

    new DOMPoint(
      bbox.x + bbox.width,
      bbox.y,
    ),

    new DOMPoint(
      bbox.x,
      bbox.y + bbox.height,
    ),

    new DOMPoint(
      bbox.x + bbox.width,
      bbox.y + bbox.height,
    ),
  ];

  const transformed =
    corners.map((point) =>
      point.matrixTransform(matrix),
    );

  const xs =
    transformed.map(
      (point) => point.x,
    );

  const ys =
    transformed.map(
      (point) => point.y,
    );

  const minX =
    Math.min(...xs);

  const maxX =
    Math.max(...xs);

  const minY =
    Math.min(...ys);

  const maxY =
    Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
function handleClick(
  event: React.MouseEvent<HTMLDivElement>,
) {
  const target =
    event.target as Element;

  const country =
    target.closest(".land");

  if (!country) {
    return;
  }

  const code =
    getCountryCode(country);







console.log(
  "COUNTRY CLICK",
  {
    code,
    classes: Array.from(
      country.classList,
    ),
    element: country,
  },
);




  if (!code) {
    return;
  }

  /*
   * IMPORTANTE:
   * Para calcular el zoom usamos solamente
   * el elemento exacto que recibió el click.
   *
   * Esto evita que territorios/islas lejanas
   * rompan el bounding box del zoom.
   */const countryElement =
  country as SVGGraphicsElement;

const svg =
  containerRef.current
    ?.querySelector<SVGSVGElement>(
      "svg",
    );

if (!svg) {
  return;
}

const bounds =
  getCountryBoundsForZoom(
    countryElement,
  );

console.log(
  "ZOOM BOUNDS",
  code,
  bounds,
);
  const name =
    countryNames.of(code) ?? code;

  const currentViewBox =
    getCurrentViewBox(svg);

  const countryViewBox =
    createCountryViewBox(bounds);

  /*
   * Animamos hacia el país.
   */
  animateViewBox(
    svg,
    currentViewBox,
    countryViewBox,
  );

  /*
   * Guardamos el país seleccionado.
   */
  setSelectedCountry({
    code,
    name,
  });

  /*
   * Activamos el modo visual
   * de territorio seleccionado.
   */
  containerRef.current?.classList.add(
    "world-map__interactive--country-selected",
  );

  /*
   * 1. Quitamos cualquier selección anterior.
   */
  containerRef.current
    ?.querySelectorAll(
      ".world-map__land--selected",
    )
    .forEach((element) => {
      element.classList.remove(
        "world-map__land--selected",
      );
    });

  /*
   * 2. Buscamos todas las piezas SVG
   * del NUEVO país seleccionado.
   *
   * Aquí sí queremos todas las piezas
   * porque algunas naciones tienen islas.
   */
  const countryElements =
    getCountryElements(code);

  /*
   * 3. Marcamos solamente el nuevo país.
   */
  countryElements.forEach((element) => {
    element.classList.add(
      "world-map__land--selected",
    );
  });
}


function getCountryElements(
  code: string,
) {
  const container =
    containerRef.current;

  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      `.land.${code.toLowerCase()}`,
    ),
  ) as SVGGraphicsElement[];
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
      onClick={handleClick}
    >
      <div
  className="world-map__svg"
  dangerouslySetInnerHTML={{
    __html: svgContent,
  }}
/>

{selectedCountry && (
  <button
    className="world-map__back"
    type="button"
    onClick={(event) => {
      event.stopPropagation();

      const svg =
  containerRef.current
    ?.querySelector<SVGSVGElement>(
      "svg",
    );

      if (!svg) {
        return;
      }

     const currentViewBox =
  getCurrentViewBox(svg);

animateViewBox(
  svg,
  currentViewBox,
  WORLD_VIEWBOX,
);

containerRef.current?.classList.remove(
  "world-map__interactive--country-selected",
);

containerRef.current
  ?.querySelectorAll(
    ".world-map__land--selected",
  )
  .forEach((element) => {
    element.classList.remove(
      "world-map__land--selected",
    );
  });


setSelectedCountry(null);
    }}
  >
    ← Mundo
  </button>
)}

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