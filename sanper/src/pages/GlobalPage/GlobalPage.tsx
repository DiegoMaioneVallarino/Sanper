
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock3,
  Globe2,
} from "lucide-react";

import {
  useSanperStories,
} from "../../features/stories/hooks/useSanperStories";

import {
  mockArticles,
} from "../../features/news/data/mockArticles";

import {
  WorldMap,
} from "../../features/global-map/components/WorldMap/WorldMap";

import type {
  Sector,
} from "../../features/stories/types/story.types";

import "./GlobalPage.css";

type GlobalFilter = "all" | Sector;

const filters: {
  id: GlobalFilter;
  label: string;
}[] = [
  { id: "all", label: "Todos" },
  { id: "geopolitics", label: "Geopolítica" },
  { id: "economy", label: "Economía" },
  { id: "markets", label: "Mercados" },
  { id: "technology", label: "Tecnología" },
  { id: "energy", label: "Energía" },
  { id: "science", label: "Ciencia" },
  { id: "business", label: "Empresas" },
];

const relevanceOrder = {
  high: 0,
  medium: 1,
  monitoring: 2,
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function GlobalPage() {
  // STORIES ENRIQUECIDAS POR INTELLIGENCE ENGINE

  const allStories = useSanperStories();

  const [activeFilter, setActiveFilter] =
    useState<GlobalFilter>("all");

  // FILTROS Y ORDENAMIENTO

  const stories = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? allStories
        : allStories.filter((story) =>
            story.sectors.includes(activeFilter),
          );

    return [...filtered].sort(
      (a, b) =>
        relevanceOrder[a.relevance] -
          relevanceOrder[b.relevance] ||
        new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
    );
  }, [activeFilter, allStories]);

  // CRONOLOGÍA

  const timeline = useMemo(
    () =>
      [...stories].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      ),
    [stories],
  );

  // ACONTECIMIENTOS DESTACADOS

  const featuredStories = stories.slice(0, 5);

  // ARTÍCULOS EDITORIALES

  const articles = useMemo(() => {
    const storyIds = new Set(
      stories.map((story) => story.id),
    );

    return [...mockArticles]
      .filter(
        (article) =>
          activeFilter === "all" ||
          (
            article.storyId &&
            storyIds.has(article.storyId)
          ),
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      )
      .slice(0, 4);
  }, [stories, activeFilter]);

  // MÉTRICAS

  const highPriority = stories.filter(
    (story) => story.relevance === "high",
  ).length;

  const territories = new Set(
    stories.flatMap((story) =>
      story.territories.map(
        (territory) => territory.code,
      ),
    ),
  ).size;

  return (
    <main className="global-page">
      {/* HEADER */}

      <header className="global-header">
        <div>
          <span className="global-eyebrow">
            SANPER / INTELIGENCIA GLOBAL
          </span>

          <h1>El mundo en contexto</h1>

          <p>
            Acontecimientos, relaciones y tendencias
            que están transformando el panorama
            internacional.
          </p>
        </div>

        <div className="global-header__identity">
          <Globe2
            size={22}
            strokeWidth={1.4}
          />

          <div>
            <strong>
              Panorama mundial
            </strong>

            <span>
              Observatorio SanPer
            </span>
          </div>
        </div>
      </header>

      {/* MÉTRICAS GLOBALES */}

      <section className="global-metrics">
        <div>
          <span>
            Acontecimientos
          </span>

          <strong>
            {stories.length}
          </strong>

          <small>
            En el conjunto seleccionado
          </small>
        </div>

        <div>
          <span>
            Alta relevancia
          </span>

          <strong>
            {highPriority}
          </strong>

          <small>
            Situaciones prioritarias
          </small>
        </div>

        <div>
          <span>
            Territorios
          </span>

          <strong>
            {territories}
          </strong>

          <small>
            Países vinculados
          </small>
        </div>
      </section>

      {/* MAPA GLOBAL */}

      <section className="global-map-section">
        <div className="global-section-heading">
          <div>
            <span className="global-eyebrow">
              MAPA DE COYUNTURA
            </span>

            <h2>
              Situación mundial
            </h2>
          </div>

          <span className="global-section-note">
            Exploración geográfica
          </span>
        </div>

        {/* FILTROS */}

        <div className="global-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={
                activeFilter === filter.id
                  ? "is-active"
                  : ""
              }
              aria-pressed={
                activeFilter === filter.id
              }
              onClick={() =>
                setActiveFilter(filter.id)
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* MAPA INTERACTIVO */}

        <div className="global-map">
          <WorldMap stories={stories} />
        </div>
      </section>

      {/* INTELIGENCIA Y CRONOLOGÍA */}

      <div className="global-intelligence-grid">
        {/* ACONTECIMIENTOS */}

        <section className="global-events">
          <div className="global-section-heading">
            <div>
              <span className="global-eyebrow">
                INTELIGENCIA
              </span>

              <h2>
                Acontecimientos clave
              </h2>
            </div>
          </div>

          <div className="global-events__list">
            {featuredStories.length === 0 && (
              <p className="global-empty">
                No hay acontecimientos en este sector.
              </p>
            )}

            {featuredStories.map((story) => {
              const linkedArticle =
                mockArticles.find(
                  (article) =>
                    article.storyId === story.id,
                );

              return (
                <article
                  className="global-event"
                  key={story.id}
                >
                  <span
                    className={`
                      global-event__signal
                      global-event__signal--${story.relevance}
                    `}
                  />

                  <div>
                    <div className="global-event__meta">
                      {story.territories
                        .map(
                          (territory) =>
                            territory.name,
                        )
                        .join(" · ")}
                    </div>

                    <h3>
                      {story.title}
                    </h3>

                    <p>
                      {story.summary}
                    </p>

                    {/* COBERTURA VINCULADA */}

                    <div className="global-event__coverage">
                      <span>
                        {story.articleIds.length}
                        {" "}artículos vinculados
                      </span>

                      <span>
                        {story.sourceIds.length}
                        {" "}fuentes
                      </span>
                    </div>

                    <div className="global-event__footer">
                      <time>
                        {formatDate(
                          story.updatedAt,
                        )}
                      </time>

                      {linkedArticle && (
                        <Link
                          to={`/noticia/${linkedArticle.slug}`}
                        >
                          Leer cobertura

                          <ArrowUpRight
                            size={13}
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CRONOLOGÍA */}

        <aside className="global-timeline">
          <div className="global-section-heading">
            <div>
              <span className="global-eyebrow">
                CRONOLOGÍA
              </span>

              <h2>
                Últimos movimientos
              </h2>
            </div>
          </div>

          <div className="global-timeline__list">
            {timeline.length === 0 && (
              <p className="global-empty">
                No hay movimientos registrados.
              </p>
            )}

            {timeline.slice(0, 8).map(
              (story) => (
                <article
                  key={story.id}
                  className="global-timeline__item"
                >
                  <div className="global-timeline__icon">
                    <Clock3 size={12} />
                  </div>

                  <div>
                    <time>
                      {formatDate(
                        story.updatedAt,
                      )}
                    </time>

                    <strong>
                      {story.title}
                    </strong>

                    <span>
                      {story.sectors.join(" · ")}
                    </span>

                    <span>
                      {story.articleIds.length}
                      {" "}artículos
                      {" · "}
                      {story.sourceIds.length}
                      {" "}fuentes
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        </aside>
      </div>

      {/* COBERTURA EDITORIAL */}

      <section className="global-editorial">
        <div className="global-section-heading">
          <div>
            <span className="global-eyebrow">
              COBERTURA
            </span>

            <h2>
              Noticias y análisis
            </h2>
          </div>
        </div>

        <div className="global-editorial__grid">
          {articles.map((article) => (
            <article
              key={article.id}
              className="global-article"
            >
              <Link
                to={`/noticia/${article.slug}`}
              >
                <img
                  src={article.image}
                  alt=""
                />
              </Link>

              <span>
                {article.category}
              </span>

              <Link
                className="global-article__title"
                to={`/noticia/${article.slug}`}
              >
                {article.title}
              </Link>

              <p>
                {article.excerpt}
              </p>

              <small>
                {article.author.name}
                {" · "}
                {article.readingTime}
                {" "}min
              </small>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="global-empty">
            No hay cobertura editorial relacionada.
          </p>
        )}
      </section>
    </main>
  );
}
