/*
 * Convierte /maps/world.svg en una cuadrícula de cuadros.
 *
 * Cómo funciona:
 * 1. Se lee el SVG y se pinta cada país (.land + código ISO)
 *    con un color único que codifica su índice.
 * 2. Se rasteriza en un canvas fuera de pantalla.
 * 3. Cada celda de la cuadrícula se muestrea: si suficientes
 *    píxeles son tierra, la celda es tierra, y su país es el
 *    color más frecuente.
 *
 * Así el mapa de cuadros usa exactamente la misma proyección
 * y los mismos códigos de país que el SVG original, sin
 * agregar datos geográficos nuevos al proyecto.
 */

import { coordinatesToWorldPercent } from "./mapCoordinates";

export const WORLD_SVG_URL = "/maps/world.svg";

export const WORLD_SIZE = {
  width: 2752.766,
  height: 1537.631,
};

export interface LandGrid {
  cols: number;
  /* Filas de la cuadrícula completa (para proyectar coordenadas). */
  rows: number;
  /* Filas que se dibujan: se recorta el mar vacío del sur. */
  visibleRows: number;
  /*
   * Por celda: -1 = agua, 0 = tierra sin país,
   * n > 0 = índice (1-based) en `codes`.
   */
  cells: Int16Array;
  codes: string[];
}

const IGNORED_CLASSES = new Set([
  "land",
  "coast",
  "lake",
  "ocean",
  "circle",
  "aq",
]);

const SHAPES =
  "path, polygon, polyline, rect, circle, ellipse, line, use";

/* Muestras por lado de cada celda (4 × 4 = 16 por celda). */
const SAMPLES = 4;

/* Proporción mínima de tierra para que una celda cuente como tierra. */
const LAND_THRESHOLD = 0.3;

/* Clases de 2 letras que no son países (p. ej. miembros de la UE). */
const NON_COUNTRY_CLASSES = new Set(["eu"]);

function isCountryCode(value: string): boolean {
  return (
    /^[a-z]{2}$/.test(value) &&
    !IGNORED_CLASSES.has(value) &&
    !NON_COUNTRY_CLASSES.has(value)
  );
}

/*
 * Código ISO del país: primero el id del elemento ("mx"),
 * si no, la última clase de 2 letras ("land eu fr" → "fr").
 */
function countryCodeOf(element: Element): string | null {
  const id = element.getAttribute("id")?.toLowerCase() ?? "";

  if (isCountryCode(id)) return id;

  const classes = Array.from(element.classList)
    .map((className) => className.toLowerCase())
    .filter(isCountryCode);

  return classes.at(-1) ?? null;
}

function indexColor(index: number): string {
  return `rgb(${index & 255}, ${(index >> 8) & 255}, 255)`;
}

function paint(element: Element, fill: string) {
  const targets = [
    element,
    ...Array.from(element.querySelectorAll(SHAPES)),
  ];

  for (const target of targets) {
    const style = (target as SVGElement).style;

    style.setProperty("display", "inline", "important");
    style.setProperty("fill", fill, "important");
    style.setProperty("fill-opacity", "1", "important");
    style.setProperty("stroke", "none", "important");
    style.setProperty("opacity", "1", "important");
  }
}

/*
 * Prepara un SVG de "colores índice": cada país con su color,
 * lagos en negro, todo lo demás oculto.
 */
function buildIndexSvg(
  svgText: string,
  width: number,
  height: number,
): { svg: string; codes: string[] } {
  /*
   * Se lee en modo HTML (tolerante), igual que cuando el SVG se
   * inyecta en la página. El modo XML estricto rechaza world.svg.
   */
  const document = new DOMParser().parseFromString(
    svgText,
    "text/html",
  );

  const root = document.querySelector("svg");

  if (!root) {
    throw new Error("world.svg no contiene un elemento <svg>.");
  }

  root.setAttribute("width", String(width));
  root.setAttribute("height", String(height));
  root.setAttribute("preserveAspectRatio", "none");
  root.setAttribute("shape-rendering", "crispEdges");

  if (!root.getAttribute("viewBox")) {
    root.setAttribute(
      "viewBox",
      `0 0 ${WORLD_SIZE.width} ${WORLD_SIZE.height}`,
    );
  }

  root
    .querySelectorAll("style, script, title, desc")
    .forEach((node) => node.remove());

  /* Todo oculto por defecto. */
  root.querySelectorAll(SHAPES).forEach((shape) => {
    (shape as SVGElement).style.setProperty(
      "display",
      "none",
      "important",
    );
  });

  const codes: string[] = [];
  const indexByCode = new Map<string, number>();

  root.querySelectorAll(".land").forEach((land) => {
    if (land.classList.contains("circle")) return;

    /* Sólo el .land más externo: sus hijos heredan su país. */
    if (land.parentElement?.closest(".land")) return;

    const code = countryCodeOf(land);

    /* Antártida fuera, como en los mapas de cuadros editoriales. */
    if (
      land.classList.contains("aq") ||
      land.getAttribute("id")?.toLowerCase() === "aq"
    ) {
      return;
    }

    let index = 0;

    if (code) {
      index = indexByCode.get(code) ?? 0;

      if (index === 0) {
        codes.push(code);
        index = codes.length;
        indexByCode.set(code, index);
      }
    }

    paint(land, indexColor(index));
  });

  /* Lagos encima, como agua. */
  root.querySelectorAll(".lake").forEach((lake) => {
    paint(lake, "rgb(0, 0, 0)");
  });

  return {
    svg: new XMLSerializer().serializeToString(root),
    codes,
  };
}

function loadImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml" }),
    );

    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo rasterizar world.svg."));
    };

    image.src = url;
  });
}

export async function buildLandGrid(
  svgText: string,
  cols: number,
): Promise<LandGrid> {
  const rows = Math.round(
    (cols * WORLD_SIZE.height) / WORLD_SIZE.width,
  );

  const width = cols * SAMPLES;
  const height = rows * SAMPLES;

  const { svg, codes } = buildIndexSvg(svgText, width, height);

  const image = await loadImage(svg);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    throw new Error("Canvas 2D no disponible.");
  }

  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, width, height);

  const pixels = context.getImageData(0, 0, width, height).data;

  const cells = new Int16Array(cols * rows).fill(-1);
  const minimum = Math.ceil(SAMPLES * SAMPLES * LAND_THRESHOLD);

  let lastLandRow = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tally = new Map<number, number>();
      let land = 0;

      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const px = col * SAMPLES + sx;
          const py = row * SAMPLES + sy;
          const offset = (py * width + px) * 4;

          const alpha = pixels[offset + 3];
          const blue = pixels[offset + 2];

          if (alpha < 200 || blue !== 255) continue;

          const index =
            pixels[offset] + (pixels[offset + 1] << 8);

          if (index > codes.length) continue;

          land++;
          tally.set(index, (tally.get(index) ?? 0) + 1);
        }
      }

      if (land < minimum) continue;

      let best = 0;
      let bestCount = -1;

      for (const [index, count] of tally) {
        /* Preferimos un país concreto sobre "tierra sin país". */
        const score = index === 0 ? count - 0.5 : count;

        if (score > bestCount) {
          best = index;
          bestCount = score;
        }
      }

      cells[row * cols + col] = best;
      lastLandRow = Math.max(lastLandRow, row);
    }
  }

  return {
    cols,
    rows,
    visibleRows: Math.min(rows, lastLandRow + 2),
    cells,
    codes,
  };
}

/* Una sola carga por sesión, compartida por todos los mapas. */
const cache = new Map<number, Promise<LandGrid>>();

export function loadLandGrid(cols: number): Promise<LandGrid> {
  let pending = cache.get(cols);

  if (!pending) {
    pending = fetch(WORLD_SVG_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${WORLD_SVG_URL}.`);
        }

        return response.text();
      })
      .then((text) => buildLandGrid(text, cols));

    pending.catch(() => cache.delete(cols));
    cache.set(cols, pending);
  }

  return pending;
}

/* Coordenadas geográficas → celda (misma calibración que el mapa SVG). */
export function coordinatesToCell(
  grid: LandGrid,
  latitude: number,
  longitude: number,
): { col: number; row: number } {
  const { x: xPercent, y: yPercent } =
    coordinatesToWorldPercent(latitude, longitude);

  return {
    col: Math.min(
      grid.cols - 1,
      Math.max(0, Math.floor((xPercent / 100) * grid.cols)),
    ),
    row: Math.min(
      grid.rows - 1,
      Math.max(0, Math.floor((yPercent / 100) * grid.rows)),
    ),
  };
}
