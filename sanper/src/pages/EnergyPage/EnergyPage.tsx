import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  Droplets,
  Flame,
  Zap,
  Atom,
  Leaf,
  Network,
} from "lucide-react";

import { mockStories } from
  "../../features/stories/data/mockStories";

import { mockArticles } from
  "../../features/news/data/mockArticles";

import { WorldMap } from
  "../../features/global-map/components/WorldMap/WorldMap";

import "./EnergyPage.css";


type EnergyCategory =
  | "all"
  | "oil"
  | "gas"
  | "electricity"
  | "nuclear"
  | "renewables"
  | "infrastructure";


const energyCategories = [
  {
    id: "oil",
    label: "Petróleo",
    description: "Producción, reservas y comercio",
    icon: Droplets,
  },
  {
    id: "gas",
    label: "Gas natural",
    description: "GNL, gasoductos y suministro",
    icon: Flame,
  },
  {
    id: "electricity",
    label: "Electricidad",
    description: "Redes, generación y demanda",
    icon: Zap,
  },
  {
    id: "nuclear",
    label: "Nuclear",
    description: "Reactores y capacidad energética",
    icon: Atom,
  },
  {
    id: "renewables",
    label: "Renovables",
    description: "Solar, eólica y almacenamiento",
    icon: Leaf,
  },
  {
    id: "infrastructure",
    label: "Infraestructura",
    description: "Rutas, terminales y conexiones",
    icon: Network,
  },
] as const;


function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}


export function EnergyPage() {
  const [activeCategory, setActiveCategory] =
    useState<EnergyCategory>("all");

  const energyStories = useMemo(
    () =>
      mockStories.filter((story) =>
        story.sectors.includes("energy"),
      ),
    [],
  );

  const energyArticles = useMemo(
    () =>
      mockArticles
        .filter(
          (article) =>
            article.category === "Energía",
        )
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        ),
    [],
  );

  const leadArticle = energyArticles[0];
  const secondaryArticles = energyArticles.slice(1, 5);

  const highPriorityStories = energyStories.filter(
    (story) => story.relevance === "high",
  );

  const monitoredCountries = new Set(
    energyStories.flatMap((story) =>
      story.territories.map(
        (territory) => territory.code,
      ),
    ),
  ).size;

  return (
    <main className="energy-page">

      {/* HEADER */}

      <header className="energy-header">
        <div className="energy-header__intro">
          <span className="energy-eyebrow">
            SANPER / INTELIGENCIA ENERGÉTICA
          </span>

          <h1>Energía</h1>

          <p>
            Recursos, infraestructura y mercados
            energéticos que determinan el
            funcionamiento de la economía mundial.
          </p>
        </div>

        <div className="energy-header__status">
          <span className="energy-live-dot" />

          <div>
            <strong>Observatorio energético</strong>
            <span>Seguimiento de acontecimientos</span>
          </div>
        </div>
      </header>


      {/* SUMMARY */}

      <section className="energy-overview">
        <div className="energy-overview__item">
          <span>Acontecimientos</span>
          <strong>{energyStories.length}</strong>
          <small>Historias registradas</small>
        </div>

        <div className="energy-overview__item">
          <span>Alta relevancia</span>
          <strong>{highPriorityStories.length}</strong>
          <small>Situaciones prioritarias</small>
        </div>

        <div className="energy-overview__item">
          <span>Territorios</span>
          <strong>{monitoredCountries}</strong>
          <small>Países vinculados</small>
        </div>

        <div className="energy-overview__item">
          <span>Publicaciones</span>
          <strong>{energyArticles.length}</strong>
          <small>Noticias y análisis</small>
        </div>
      </section>


      {/* MAP */}

      <section className="energy-map-section">
        <div className="energy-section-heading">
          <div>
            <span className="energy-eyebrow">
              INTELIGENCIA GEOGRÁFICA
            </span>

            <h2>Mapa energético mundial</h2>
          </div>

          <div className="energy-map-legend">
            <span>
              <i className="energy-dot energy-dot--high" />
              Alta
            </span>

            <span>
              <i className="energy-dot energy-dot--medium" />
              Media
            </span>

            <span>
              <i className="energy-dot energy-dot--monitoring" />
              Seguimiento
            </span>
          </div>
        </div>

        <div className="energy-map-container">
          <WorldMap stories={energyStories} />
        </div>

        <div className="energy-map-footer">
          <span>
            <Activity size={13} />
            Acontecimientos geolocalizados
          </span>

          <span>
            Selecciona un país para explorar el mapa
          </span>
        </div>
      </section>


      {/* ENERGY SECTORS */}

      <section className="energy-sectors">
        <div className="energy-section-heading">
          <div>
            <span className="energy-eyebrow">
              SISTEMA ENERGÉTICO
            </span>
            <h2>Sectores estratégicos</h2>
          </div>
        </div>

        <div className="energy-sector-grid">
          {energyCategories.map((category) => {
            const Icon = category.icon;
            const isActive =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className={`energy-sector ${
                  isActive ? "is-active" : ""
                }`}
                onClick={() =>
                  setActiveCategory(
                    isActive ? "all" : category.id,
                  )
                }
              >
                <div className="energy-sector__top">
                  <Icon size={19} strokeWidth={1.5} />
                  <ArrowUpRight size={13} />
                </div>

                <strong>{category.label}</strong>
                <span>{category.description}</span>
              </button>
            );
          })}
        </div>

        <p className="energy-sector-note">
          {activeCategory === "all"
            ? "Selecciona un sector para explorar sus áreas de seguimiento."
            : `Área seleccionada: ${
                energyCategories.find(
                  (category) =>
                    category.id === activeCategory,
                )?.label
              }. La clasificación por subsector se conectará cuando incorporemos este atributo a las Stories.`}
        </p>
      </section>


      {/* ACTIVE STORIES */}

      <section className="energy-stories">
        <div className="energy-section-heading">
          <div>
            <span className="energy-eyebrow">
              ACONTECIMIENTOS
            </span>
            <h2>Situaciones energéticas activas</h2>
          </div>

          <span className="energy-section-count">
            {energyStories.length} historias
          </span>
        </div>

        <div className="energy-stories__list">
          {energyStories.length === 0 ? (
            <div className="energy-empty">
              No hay acontecimientos energéticos registrados.
            </div>
          ) : (
            energyStories.map((story) => (
              <article
                key={story.id}
                className="energy-story"
              >
                <div
                  className={`energy-story__signal energy-story__signal--${story.relevance}`}
                />

                <div className="energy-story__content">
                  <div className="energy-story__meta">
                    {story.territories
                      .map((territory) => territory.name)
                      .join(" · ")}

                    {story.location &&
                      ` / ${story.location.name}`}
                  </div>

                  <h3>{story.title}</h3>
                  <p>{story.summary}</p>

                  <div className="energy-story__footer">
                    <span>
                      {story.relevance === "high"
                        ? "Alta relevancia"
                        : story.relevance === "medium"
                          ? "Relevancia media"
                          : "En seguimiento"}
                    </span>

                    <time>
                      {formatDate(story.updatedAt)}
                    </time>
                  </div>
                </div>

                {story.articleIds.length > 0 && (
                  <Link
                    className="energy-story__link"
                    to={
                      (() => {
                        const article =
                          mockArticles.find(
                            (item) =>
                              story.articleIds.includes(
                                item.id,
                              ),
                          );

                        return article
                          ? `/noticia/${article.slug}`
                          : "/energia";
                      })()
                    }
                    aria-label={`Leer sobre ${story.title}`}
                  >
                    <ArrowUpRight size={17} />
                  </Link>
                )}
              </article>
            ))
          )}
        </div>
      </section>


      {/* EDITORIAL */}

      <section className="energy-editorial">
        <div className="energy-section-heading">
          <div>
            <span className="energy-eyebrow">
              EDITORIAL
            </span>
            <h2>Energía ahora</h2>
          </div>
        </div>

        {leadArticle ? (
          <div className="energy-editorial__layout">
            <article className="energy-featured">
              <Link
                to={`/noticia/${leadArticle.slug}`}
                className="energy-featured__image"
              >
                <img src={leadArticle.image} alt="" />
              </Link>

              <div className="energy-featured__content">
                <span className="energy-eyebrow">
                  {leadArticle.category} /{" "}
                  {leadArticle.type === "analysis"
                    ? "ANÁLISIS"
                    : "NOTICIA"}
                </span>

                <Link
                  to={`/noticia/${leadArticle.slug}`}
                  className="energy-featured__title"
                >
                  {leadArticle.title}
                </Link>

                <p>{leadArticle.excerpt}</p>

                <div className="energy-article-meta">
                  <span>{leadArticle.author.name}</span>
                  <span>·</span>
                  <span>
                    {leadArticle.readingTime} min
                  </span>
                </div>
              </div>
            </article>

            <div className="energy-secondary">
              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  className="energy-secondary__item"
                >
                  <div>
                    <span className="energy-eyebrow">
                      {article.category}
                    </span>

                    <Link
                      to={`/noticia/${article.slug}`}
                    >
                      {article.title}
                    </Link>

                    <small>
                      {article.readingTime} min de lectura
                    </small>
                  </div>

                  <Link
                    to={`/noticia/${article.slug}`}
                    className="energy-secondary__image"
                  >
                    <img src={article.image} alt="" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="energy-empty">
            Los artículos de Energía aparecerán aquí.
          </div>
        )}
      </section>

    </main>
  );
}