import { Link } from "react-router-dom";

import { mockEvents } from "../../data/mockEvents";

import "./GlobalOverview.css";

export function GlobalOverview() {
  return (
    <section className="global-overview">

      <header className="global-overview__header">
        <div>
          <span className="global-overview__eyebrow">
            Coyuntura global
          </span>

          <h2 className="global-overview__heading">
            El mundo ahora
          </h2>
        </div>

        <Link
          className="global-overview__map-link"
          to="/mapa"
        >
          Abrir mapa
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="global-overview__grid">

        <div className="global-overview__map">

          <div className="global-overview__map-background">
            <WorldPlaceholder />

            <span
              className="
                global-overview__marker
                global-overview__marker--europe
                global-overview__marker--high
              "
            />

            <span
              className="
                global-overview__marker
                global-overview__marker--middle-east
                global-overview__marker--high
              "
            />

            <span
              className="
                global-overview__marker
                global-overview__marker--asia
                global-overview__marker--medium
              "
            />
          </div>

          <div className="global-overview__legend">
            <LegendItem
              type="high"
              label="Alta relevancia"
            />

            <LegendItem
              type="medium"
              label="Relevancia media"
            />

            <LegendItem
              type="monitoring"
              label="Seguimiento"
            />
          </div>

        </div>

        <div className="global-overview__events">
          {mockEvents.map((event) => (
            <article
              className="global-overview__event"
              key={event.id}
            >
              <div className="global-overview__event-top">
                <span className="global-overview__region">
                  {event.region}
                </span>

                <RelevanceIndicator
                  relevance={event.relevance}
                />
              </div>

              <h3 className="global-overview__event-title">
                {event.title}
              </h3>

              <p className="global-overview__event-summary">
                {event.summary}
              </p>

              <span className="global-overview__event-link">
                Ver contexto
                <span aria-hidden="true"> →</span>
              </span>
            </article>
          ))}
        </div>

      </div>

    </section>
  );
}

interface RelevanceIndicatorProps {
  relevance: "high" | "medium" | "monitoring";
}

function RelevanceIndicator({
  relevance,
}: RelevanceIndicatorProps) {
  return (
    <span
      className={`
        global-overview__relevance
        global-overview__relevance--${relevance}
      `}
      aria-label={`Relevancia: ${relevance}`}
    />
  );
}

interface LegendItemProps {
  type: "high" | "medium" | "monitoring";
  label: string;
}

function LegendItem({
  type,
  label,
}: LegendItemProps) {
  return (
    <div className="global-overview__legend-item">
      <span
        className={`
          global-overview__legend-dot
          global-overview__legend-dot--${type}
        `}
      />

      <span>{label}</span>
    </div>
  );
}

function WorldPlaceholder() {
  return (
    <div className="global-overview__world">
      <span className="global-overview__continent global-overview__continent--america" />
      <span className="global-overview__continent global-overview__continent--europe" />
      <span className="global-overview__continent global-overview__continent--africa" />
      <span className="global-overview__continent global-overview__continent--asia" />
      <span className="global-overview__continent global-overview__continent--oceania" />
    </div>
  );
}