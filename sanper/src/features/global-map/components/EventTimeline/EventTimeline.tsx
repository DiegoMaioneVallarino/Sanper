import { useMemo } from "react";

import type { Story } from "../../../../shared/domain";

import "./EventTimeline.css";

const DAY = 86_400_000;

const dayFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

const fullFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const monthFormat = new Intl.DateTimeFormat("es-MX", {
  month: "short",
});

export interface TimelineRange {
  start: number;
  end: number;
}

/* Rango de la línea: del primer acontecimiento al último, con margen. */
export function timelineRange(stories: Story[]): TimelineRange {
  if (stories.length === 0) {
    const now = Date.now();
    return { start: now - 30 * DAY, end: now };
  }

  const starts = stories.map((story) => Date.parse(story.startedAt));
  const ends = stories.map((story) => Date.parse(story.updatedAt));

  return {
    start: Math.min(...starts) - 2 * DAY,
    end: Math.max(...ends) + DAY,
  };
}

interface Placed {
  story: Story;
  left: number;
  width: number;
  lane: number;
}

const LANES = 3;

/* Acomoda los acontecimientos en carriles para que no se encimen. */
function placeStories(
  stories: Story[],
  range: TimelineRange,
): Placed[] {
  const span = range.end - range.start;
  const laneEnds = Array<number>(LANES).fill(-Infinity);

  return [...stories]
    .sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt))
    .map((story) => {
      const left =
        ((Date.parse(story.startedAt) - range.start) / span) * 100;
      const right =
        ((Date.parse(story.updatedAt) - range.start) / span) * 100;

      let lane = laneEnds.findIndex((end) => end + 1.5 < left);

      if (lane === -1) {
        lane = laneEnds.indexOf(Math.min(...laneEnds));
      }

      laneEnds[lane] = Math.max(right, left + 1);

      return {
        story,
        left,
        width: Math.max(right - left, 0),
        lane,
      };
    });
}

function monthTicks(range: TimelineRange) {
  const ticks: { left: number; label: string }[] = [];
  const span = range.end - range.start;

  const cursor = new Date(range.start);
  cursor.setDate(1);
  cursor.setHours(0, 0, 0, 0);
  cursor.setMonth(cursor.getMonth() + 1);

  while (cursor.getTime() < range.end) {
    ticks.push({
      left: ((cursor.getTime() - range.start) / span) * 100,
      label: monthFormat.format(cursor),
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return ticks;
}

export interface EventTimelineProps {
  stories: Story[];
  range: TimelineRange;
  cursor: number;
  playing: boolean;
  selectedStoryId: string | null;
  highlightedStoryId: string | null;
  onCursorChange: (time: number) => void;
  onTogglePlay: () => void;
  onSelectStory: (storyId: string | null) => void;
  onHighlightStory: (storyId: string | null) => void;
}

export function EventTimeline({
  stories,
  range,
  cursor,
  playing,
  selectedStoryId,
  highlightedStoryId,
  onCursorChange,
  onTogglePlay,
  onSelectStory,
  onHighlightStory,
}: EventTimelineProps) {
  const placed = useMemo(
    () => placeStories(stories, range),
    [stories, range],
  );

  const ticks = useMemo(() => monthTicks(range), [range]);

  const span = range.end - range.start;
  const cursorLeft = ((cursor - range.start) / span) * 100;
  const atEnd = cursor >= range.end;

  const visibleCount = stories.filter(
    (story) => Date.parse(story.startedAt) <= cursor,
  ).length;

  return (
    <div className="event-timeline">
      <div className="event-timeline__controls">
        <button
          type="button"
          className="event-timeline__play"
          onClick={onTogglePlay}
          aria-label={playing ? "Pausar" : "Reproducir la línea de tiempo"}
        >
          {playing ? (
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <rect x="2" y="1.5" width="3" height="9" />
              <rect x="7" y="1.5" width="3" height="9" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.5 L10.5 6 L3 10.5 Z" />
            </svg>
          )}
        </button>

        <div className="event-timeline__label">
          <strong>{atEnd ? "Hoy" : fullFormat.format(cursor)}</strong>
          <span>
            {visibleCount} de {stories.length} acontecimientos
          </span>
        </div>

        {!atEnd && (
          <button
            type="button"
            className="event-timeline__now"
            onClick={() => onCursorChange(range.end)}
          >
            Ir a hoy
          </button>
        )}
      </div>

      <div className="event-timeline__track">
        {ticks.map((tick) => (
          <span
            key={tick.left}
            className="event-timeline__tick"
            style={{ left: `${tick.left}%` }}
          >
            {tick.label}
          </span>
        ))}

        <div
          className="event-timeline__past"
          style={{ width: `${Math.min(cursorLeft, 100)}%` }}
        />

        {placed.map(({ story, left, width, lane }) => {
          const visible = Date.parse(story.startedAt) <= cursor;

          return (
            <button
              key={story.id}
              type="button"
              className={[
                "event-timeline__event",
                `event-timeline__event--${story.relevance}`,
                visible ? "" : "event-timeline__event--future",
                story.id === selectedStoryId
                  ? "event-timeline__event--selected"
                  : "",
                story.id === highlightedStoryId
                  ? "event-timeline__event--highlighted"
                  : "",
              ].join(" ")}
              style={{
                left: `${left}%`,
                top: `${8 + lane * 11}px`,
              }}
              title={`${dayFormat.format(Date.parse(story.startedAt))} · ${story.title}`}
              aria-label={`${dayFormat.format(Date.parse(story.startedAt))}: ${story.title}`}
              onMouseEnter={() => onHighlightStory(story.id)}
              onMouseLeave={() => onHighlightStory(null)}
              onClick={() => {
                if (!visible) {
                  onCursorChange(Date.parse(story.startedAt));
                }

                onSelectStory(story.id);
              }}
            >
              <span
                className="event-timeline__duration"
                style={{ width: `calc(${width}cqw)` }}
              />
            </button>
          );
        })}

        <div
          className="event-timeline__cursor"
          style={{ left: `${Math.min(cursorLeft, 100)}%` }}
        />

        <input
          className="event-timeline__range"
          type="range"
          min={range.start}
          max={range.end}
          step={3_600_000}
          value={Math.min(cursor, range.end)}
          aria-label="Fecha de la línea de tiempo"
          onChange={(event) =>
            onCursorChange(Number(event.target.value))
          }
        />
      </div>
    </div>
  );
}
