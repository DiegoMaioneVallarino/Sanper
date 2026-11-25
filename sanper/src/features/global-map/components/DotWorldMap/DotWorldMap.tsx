import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Story } from "../../../../shared/domain";

import { worldCapitals } from "../../data/worldCapitals";

import {
  coordinatesToCell,
  loadLandGrid,
  type LandGrid,
} from "../../utils/landGrid";

import "./DotWorldMap.css";

/* Columnas de la cuadrícula: más = cuadros más pequeños. */
const GRID_COLUMNS = 190;

/* Tamaño del cuadro dentro de su celda. */
const SQUARE_RATIO = 0.72;

const COLORS = {
  land: "rgba(150, 190, 168, 0.20)",
  landHover: "rgba(190, 225, 205, 0.55)",
  capital: "rgba(242, 213, 138, 0.55)",
  involved: "rgba(229, 72, 77, 0.92)",
  affected: "rgba(233, 154, 24, 0.78)",
  tint: {
    high: "rgba(229, 72, 77, 0.26)",
    medium: "rgba(233, 154, 24, 0.22)",
    monitoring: "rgba(160, 175, 168, 0.26)",
  },
};

const RELEVANCE_LABEL: Record<Story["relevance"], string> = {
  high: "Alta relevancia",
  medium: "Relevancia media",
  monitoring: "Seguimiento",
};

const countryNames = new Intl.DisplayNames(["es"], {
  type: "region",
});

function countryName(code: string): string {
  try {
    return countryNames.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

interface Layout {
  cell: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

interface HoverState {
  code: string | null;
  x: number;
  y: number;
}

export interface DotWorldMapProps {
  stories: Story[];
  selectedStoryId: string | null;
  highlightedStoryId: string | null;
  /* Historias que acaban de aparecer en la línea de tiempo: laten. */
  freshStoryIds: Set<string>;
  onSelectStory: (storyId: string | null) => void;
  onHighlightStory: (storyId: string | null) => void;
}

export function DotWorldMap({
  stories,
  selectedStoryId,
  highlightedStoryId,
  freshStoryIds,
  onSelectStory,
  onHighlightStory,
}: DotWorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [grid, setGrid] = useState<LandGrid | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hover, setHover] = useState<HoverState | null>(null);

  /* 1. Cargar la cuadrícula (una vez por sesión). */
  useEffect(() => {
    let active = true;

    loadLandGrid(GRID_COLUMNS)
      .then((loaded) => {
        if (active) setGrid(loaded);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "No se pudo cargar el mapa.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /* 2. Seguir el tamaño del contenedor. */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  /* 3. Geometría: cuadros siempre cuadrados, mapa centrado. */
  const layout = useMemo<Layout | null>(() => {
    if (!grid || size.width === 0 || size.height === 0) {
      return null;
    }

    const cell = Math.min(
      size.width / grid.cols,
      size.height / grid.visibleRows,
    );

    return {
      cell,
      offsetX: (size.width - cell * grid.cols) / 2,
      offsetY: (size.height - cell * grid.visibleRows) / 2,
      width: size.width,
      height: size.height,
    };
  }, [grid, size]);

  /* Índice de país por código y viceversa. */
  const codeIndex = useMemo(() => {
    const map = new Map<string, number>();
    grid?.codes.forEach((code, i) => map.set(code, i + 1));
    return map;
  }, [grid]);

  const focusStory = useMemo(
    () =>
      stories.find((story) => story.id === selectedStoryId) ??
      stories.find((story) => story.id === highlightedStoryId) ??
      null,
    [stories, selectedStoryId, highlightedStoryId],
  );

  /*
   * Color por país:
   * - historia enfocada: involucrados en rojo, afectados en ámbar;
   * - resto de historias visibles: tinte suave por relevancia.
   */
  const countryColors = useMemo(() => {
    const colors = new Map<number, string>();

    const rank = { high: 0, medium: 1, monitoring: 2 } as const;

    const ordered = [...stories].sort(
      (a, b) => rank[b.relevance] - rank[a.relevance],
    );

    for (const story of ordered) {
      for (const { countryCode, role } of story.countries) {
        if (role !== "involved") continue;

        const index = codeIndex.get(countryCode.toLowerCase());

        if (index) colors.set(index, COLORS.tint[story.relevance]);
      }
    }

    if (focusStory) {
      for (const { countryCode, role } of focusStory.countries) {
        const index = codeIndex.get(countryCode.toLowerCase());

        if (!index) continue;

        colors.set(
          index,
          role === "involved" ? COLORS.involved : COLORS.affected,
        );
      }
    }

    return colors;
  }, [stories, focusStory, codeIndex]);

  const capitalCells = useMemo(() => {
    const cells = new Set<number>();

    if (!grid) return cells;

    for (const capital of worldCapitals) {
      const { col, row } = coordinatesToCell(
        grid,
        capital.latitude,
        capital.longitude,
      );

      cells.add(row * grid.cols + col);
    }

    return cells;
  }, [grid]);

  const hoveredIndex = hover?.code
    ? codeIndex.get(hover.code) ?? null
    : null;

  /* 4. Dibujar. */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !grid || !layout) return;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(layout.width * ratio);
    canvas.height = Math.round(layout.height * ratio);
    canvas.style.width = `${layout.width}px`;
    canvas.style.height = `${layout.height}px`;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, layout.width, layout.height);

    const square = layout.cell * SQUARE_RATIO;
    const inset = (layout.cell - square) / 2;

    for (let row = 0; row < grid.visibleRows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const position = row * grid.cols + col;
        const value = grid.cells[position];

        if (value < 0) continue;

        let fill = COLORS.land;

        if (value > 0 && countryColors.has(value)) {
          fill = countryColors.get(value) as string;
        } else if (value > 0 && value === hoveredIndex) {
          fill = COLORS.landHover;
        } else if (capitalCells.has(position)) {
          fill = COLORS.capital;
        }

        context.fillStyle = fill;
        context.fillRect(
          layout.offsetX + col * layout.cell + inset,
          layout.offsetY + row * layout.cell + inset,
          square,
          square,
        );
      }
    }
  }, [grid, layout, countryColors, capitalCells, hoveredIndex]);

  /* Posición en píxeles de cada acontecimiento. */
  const markers = useMemo(() => {
    if (!grid || !layout) return [];

    return stories
      .filter((story) => story.location)
      .map((story) => {
        const location = story.location as NonNullable<Story["location"]>;
        const { col, row } = coordinatesToCell(
          grid,
          location.latitude,
          location.longitude,
        );

        return {
          story,
          x: layout.offsetX + (col + 0.5) * layout.cell,
          y: layout.offsetY + (row + 0.5) * layout.cell,
        };
      });
  }, [stories, grid, layout]);

  function cellAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current;

    if (!canvas || !grid || !layout) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor((x - layout.offsetX) / layout.cell);
    const row = Math.floor((y - layout.offsetY) / layout.cell);

    if (
      col < 0 ||
      row < 0 ||
      col >= grid.cols ||
      row >= grid.visibleRows
    ) {
      return { x, y, code: null };
    }

    const value = grid.cells[row * grid.cols + col];

    return {
      x,
      y,
      code: value > 0 ? grid.codes[value - 1] : null,
    };
  }

  function storiesForCountry(code: string) {
    return stories.filter((story) =>
      story.countries.some(
        (country) => country.countryCode.toLowerCase() === code,
      ),
    );
  }

  const hoverStories = hover?.code ? storiesForCountry(hover.code) : [];

  const markerSize = layout ? Math.max(layout.cell * 2.2, 11) : 11;

  return (
    <div className="dot-map" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="dot-map__canvas"
        onMouseMove={(event) =>
          setHover(cellAt(event.clientX, event.clientY))
        }
        onMouseLeave={() => setHover(null)}
        onClick={(event) => {
          const target = cellAt(event.clientX, event.clientY);
          const related = target?.code
            ? storiesForCountry(target.code)
            : [];

          onSelectStory(related[0]?.id ?? null);
        }}
      />

      {!grid && !error && (
        <p className="dot-map__status">Cargando mapa…</p>
      )}

      {error && <p className="dot-map__status">{error}</p>}

      {markers.map(({ story, x, y }) => {
        const isSelected = story.id === selectedStoryId;
        const isHighlighted = story.id === highlightedStoryId;
        const isFresh = freshStoryIds.has(story.id);

        return (
          <button
            key={story.id}
            type="button"
            className={[
              "dot-map__marker",
              `dot-map__marker--${story.relevance}`,
              isFresh ? "dot-map__marker--fresh" : "",
              isSelected ? "dot-map__marker--selected" : "",
              isHighlighted ? "dot-map__marker--highlighted" : "",
            ].join(" ")}
            style={{
              left: x,
              top: y,
              width: markerSize,
              height: markerSize,
            }}
            aria-label={`${story.title}, ${story.location?.name ?? ""}`}
            aria-pressed={isSelected}
            onMouseEnter={() => onHighlightStory(story.id)}
            onMouseLeave={() => onHighlightStory(null)}
            onFocus={() => onHighlightStory(story.id)}
            onBlur={() => onHighlightStory(null)}
            onClick={() =>
              onSelectStory(isSelected ? null : story.id)
            }
          >
            <span className="dot-map__marker-ring" />

            {isHighlighted && !isSelected && (
              <span className="dot-map__tooltip" role="tooltip">
                <small>
                  {RELEVANCE_LABEL[story.relevance]} ·{" "}
                  {story.location?.name}
                </small>
                <strong>{story.title}</strong>
              </span>
            )}
          </button>
        );
      })}

      {hover?.code && !highlightedStoryId && (
        <div
          className="dot-map__country"
          style={{ left: hover.x, top: hover.y }}
        >
          <strong>{countryName(hover.code)}</strong>
          <span>
            {hoverStories.length === 0
              ? "Sin acontecimientos"
              : hoverStories.length === 1
                ? "1 acontecimiento"
                : `${hoverStories.length} acontecimientos`}
          </span>
        </div>
      )}
    </div>
  );
}
