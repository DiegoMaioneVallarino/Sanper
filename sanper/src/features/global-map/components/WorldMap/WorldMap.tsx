import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  Sector,
  Story,
} from "../../../../shared/domain";

import { sectorConfig } from "../../../stories/config/sectors";
import { SectorIcon } from "../../../stories/components/SectorIcon/SectorIcon";

import { DotWorldMap } from "../DotWorldMap/DotWorldMap";
import {
  EventTimeline,
  timelineRange,
} from "../EventTimeline/EventTimeline";
import { StoryCard } from "./StoryCard";

import "./WorldMap.css";

interface WorldMapProps {
  stories: Story[];
}

type SectorFilter = "all" | Sector;

const sectors: Sector[] = [
  "geopolitics",
  "economy",
  "markets",
  "technology",
  "energy",
  "science",
  "business",
];

/* Duración de la reproducción completa de la línea de tiempo. */
const PLAYBACK_MS = 12_000;

/* Un acontecimiento "late" en el mapa durante sus primeros días. */
const FRESH_WINDOW_MS = 4 * 86_400_000;

export function WorldMap({ stories }: WorldMapProps) {
  const [activeSector, setActiveSector] =
    useState<SectorFilter>("all");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const sectorStories = useMemo(
    () =>
      activeSector === "all"
        ? stories
        : stories.filter((story) =>
            story.sectors.includes(activeSector),
          ),
    [stories, activeSector],
  );

  /* El rango usa todas las historias para no saltar al filtrar. */
  const range = useMemo(() => timelineRange(stories), [stories]);

  const [cursor, setCursor] = useState(range.end);
  const [playing, setPlaying] = useState(false);

  /* Último valor del cursor, para arrancar la reproducción desde ahí. */
  const cursorRef = useRef(cursor);
  cursorRef.current = cursor;

  /* Si llegan historias nuevas (API), el cursor vuelve a "hoy". */
  useEffect(() => {
    setCursor(range.end);
    setPlaying(false);
  }, [range.end]);

  /* Reproducción: avanza el cursor del inicio al final. */
  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    const from = cursorRef.current;
    const startedAt = performance.now();
    const step = (range.end - range.start) / PLAYBACK_MS;

    const tick = (now: number) => {
      const next = from + (now - startedAt) * step;

      if (next >= range.end) {
        setCursor(range.end);
        setPlaying(false);
        return;
      }

      setCursor(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [playing, range]);

  const visibleStories = useMemo(
    () =>
      sectorStories.filter(
        (story) => Date.parse(story.startedAt) <= cursor,
      ),
    [sectorStories, cursor],
  );

  const freshStoryIds = useMemo(
    () =>
      new Set(
        visibleStories
          .filter(
            (story) =>
              cursor - Date.parse(story.startedAt) <= FRESH_WINDOW_MS ||
              (cursor >= range.end &&
                story.relevance === "high"),
          )
          .map((story) => story.id),
      ),
    [visibleStories, cursor, range.end],
  );

  const selectedStory =
    visibleStories.find((story) => story.id === selectedId) ?? null;

  /* Si la historia seleccionada deja de verse, se cierra la tarjeta. */
  useEffect(() => {
    if (selectedId && !selectedStory) {
      setSelectedId(null);
    }
  }, [selectedId, selectedStory]);

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }

    if (cursor >= range.end) {
      cursorRef.current = range.start;
      setCursor(range.start);
    }

    setSelectedId(null);
    setPlaying(true);
  }

  return (
    <div className="world-map">
      <div className="world-map__filters">
        <button
          className={`world-map__filter ${
            activeSector === "all" ? "world-map__filter--active" : ""
          }`}
          type="button"
          onClick={() => setActiveSector("all")}
        >
          Todos
          <span className="world-map__filter-count">
            {stories.length}
          </span>
        </button>

        {sectors.map((sector) => {
          const count = stories.filter((story) =>
            story.sectors.includes(sector),
          ).length;

          return (
            <button
              key={sector}
              className={`world-map__filter ${
                activeSector === sector
                  ? "world-map__filter--active"
                  : ""
              }`}
              type="button"
              onClick={() => setActiveSector(sector)}
            >
              <SectorIcon sector={sector} size={13} />
              {sectorConfig[sector].label}
              <span className="world-map__filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="world-map__canvas">
        <DotWorldMap
          stories={visibleStories}
          selectedStoryId={selectedId}
          highlightedStoryId={highlightedId}
          freshStoryIds={freshStoryIds}
          onSelectStory={(id) => {
            setPlaying(false);
            setSelectedId(id);
          }}
          onHighlightStory={setHighlightedId}
        />

        {selectedStory && (
          <StoryCard
            story={selectedStory}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <EventTimeline
        stories={sectorStories}
        range={range}
        cursor={cursor}
        playing={playing}
        selectedStoryId={selectedId}
        highlightedStoryId={highlightedId}
        onCursorChange={(time) => {
          setPlaying(false);
          setCursor(time);
        }}
        onTogglePlay={togglePlay}
        onSelectStory={(id) => {
          setPlaying(false);
          setSelectedId(id);
        }}
        onHighlightStory={setHighlightedId}
      />
    </div>
  );
}
