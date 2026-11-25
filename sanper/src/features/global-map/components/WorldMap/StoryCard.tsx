import type { Story } from "../../../../shared/domain";

import { sectorConfig } from "../../../stories/config/sectors";
import { SectorIcon } from "../../../stories/components/SectorIcon/SectorIcon";

const RELEVANCE_LABEL: Record<Story["relevance"], string> = {
  high: "Alta relevancia",
  medium: "Relevancia media",
  monitoring: "Seguimiento",
};

const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

const countryNames = new Intl.DisplayNames(["es"], {
  type: "region",
});

function name(code: string) {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

interface StoryCardProps {
  story: Story;
  onClose: () => void;
}

/* Detalle del acontecimiento seleccionado, sobre el mapa. */
export function StoryCard({ story, onClose }: StoryCardProps) {
  const involved = story.countries
    .filter((country) => country.role === "involved")
    .map((country) => name(country.countryCode));

  const affected = story.countries
    .filter((country) => country.role === "affected")
    .map((country) => name(country.countryCode));

  const started = dateFormat.format(Date.parse(story.startedAt));
  const updated = dateFormat.format(Date.parse(story.updatedAt));

  return (
    <article
      className={[
        "story-card",
        `story-card--${story.relevance}`,
        /* La tarjeta va del lado contrario al acontecimiento. */
        (story.location?.longitude ?? 0) > 20 ? "story-card--left" : "",
      ].join(" ")}
      aria-live="polite"
    >
      <header className="story-card__top">
        <span className="story-card__relevance">
          <i aria-hidden="true" />
          {RELEVANCE_LABEL[story.relevance]}
        </span>

        <button
          type="button"
          className="story-card__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      </header>

      <h3>{story.title}</h3>

      <p>{story.summary}</p>

      <dl className="story-card__facts">
        {story.location && (
          <>
            <dt>Lugar</dt>
            <dd>{story.location.name}</dd>
          </>
        )}

        <dt>Fechas</dt>
        <dd>
          {started === updated
            ? started
            : `${started} → ${updated}`}
        </dd>

        {involved.length > 0 && (
          <>
            <dt>Involucrados</dt>
            <dd>
              <i className="story-card__swatch story-card__swatch--involved" />
              {involved.join(", ")}
            </dd>
          </>
        )}

        {affected.length > 0 && (
          <>
            <dt>Afectados</dt>
            <dd>
              <i className="story-card__swatch story-card__swatch--affected" />
              {affected.join(", ")}
            </dd>
          </>
        )}
      </dl>

      <footer className="story-card__footer">
        <span className="story-card__sectors">
          {story.sectors.map((sector) => (
            <span key={sector} title={sectorConfig[sector].label}>
              <SectorIcon sector={sector} size={12} />
            </span>
          ))}
        </span>

        <span>
          {story.articleIds.length} artículos ·{" "}
          {story.sourceIds.length} fuentes
        </span>
      </footer>
    </article>
  );
}
