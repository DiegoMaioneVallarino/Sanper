import {
  useMemo,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  mockStories,
} from "../../features/stories/data/mockStories";

import {
  mockArticles,
} from "../../features/news/data/mockArticles";

import {
  WorldMap,
} from "../../features/global-map/components/WorldMap/WorldMap";

import "./EconomyPage.css";


const indicators = [
  {
    id: "growth",
    label: "Crecimiento global",
    value: "2.8%",
    change: "2026",
    direction: "neutral",
  },
  {
    id: "inflation",
    label: "Inflación",
    value: "3.4%",
    change: "Promedio",
    direction: "down",
  },
  {
    id: "rates",
    label: "Tasas",
    value: "4.25%",
    change: "Referencia",
    direction: "neutral",
  },
  {
    id: "employment",
    label: "Empleo",
    value: "5.1%",
    change: "Desempleo",
    direction: "up",
  },
];


export function EconomyPage() {
  const economyStories =
    useMemo(
      () =>
        mockStories.filter(
          (story) =>
            story.sectors.includes(
              "economy",
            ),
        ),
      [],
    );


  const economyArticles =
    useMemo(
      () =>
        mockArticles.filter(
          (article) =>
            article.category ===
            "Economía",
        ),
      [],
    );


  const leadArticle =
    economyArticles[0];

  const secondaryArticles =
    economyArticles.slice(1, 4);


  return (
    <main className="economy-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="economy-header">

        <div className="economy-header__title">
          <span>
            SANPER / ECONOMÍA
          </span>

          <h1>
            Economía
          </h1>

          <p>
            Actividad económica,
            inflación, política monetaria
            y transformaciones de la
            economía mundial.
          </p>
        </div>


        <div className="economy-header__status">
          <span className="economy-header__pulse" />

          <div>
            <strong>
              Panorama global
            </strong>

            <span>
              Actualización continua
            </span>
          </div>
        </div>

      </header>


      {/* ===================================================
          INDICATORS
          =================================================== */}

      <section className="economy-indicators">

        {indicators.map(
          (indicator) => (
            <article
              key={indicator.id}
              className="economy-indicator"
            >

              <span className="economy-indicator__label">
                {indicator.label}
              </span>

              <div className="economy-indicator__value">
                {indicator.value}
              </div>

              <div
                className={
                  `economy-indicator__change economy-indicator__change--${indicator.direction}`
                }
              >
                {indicator.change}
              </div>

            </article>
          ),
        )}

      </section>


      {/* ===================================================
          MAP
          =================================================== */}

      <section className="economy-map">

        <div className="economy-section-heading">

          <div>
            <span>
              ACTIVIDAD ECONÓMICA
            </span>

            <h2>
              Economía mundial
            </h2>
          </div>


          <div className="economy-map__legend">

            <span>
              <i className="is-high" />
              Alta relevancia
            </span>

            <span>
              <i className="is-medium" />
              Media
            </span>

            <span>
              <i className="is-monitoring" />
              Seguimiento
            </span>

          </div>

        </div>


        <div className="economy-map__canvas">
          <WorldMap
            stories={economyStories}
          />
        </div>

      </section>


      {/* ===================================================
          EDITORIAL
          =================================================== */}

      <section className="economy-editorial">

        <div className="economy-section-heading">

          <div>
            <span>
              EDITORIAL
            </span>

            <h2>
              Economía ahora
            </h2>
          </div>

        </div>


        {leadArticle ? (
          <div className="economy-news-layout">

            {/* LEAD */}

            <article className="economy-lead">

              <Link
                to={`/noticia/${leadArticle.slug}`}
                className="economy-lead__image"
              >
                <img
                  src={leadArticle.image}
                  alt=""
                />
              </Link>


              <div className="economy-lead__content">

                <span className="economy-article-category">
                  {leadArticle.category}
                </span>

                <Link
                  to={`/noticia/${leadArticle.slug}`}
                  className="economy-lead__title"
                >
                  {leadArticle.title}
                </Link>

                <p>
                  {leadArticle.excerpt}
                </p>


                <div className="economy-article-meta">
                  <span>
                    {
                      leadArticle.author
                        .name
                    }
                  </span>

                  <span>
                    ·
                  </span>

                  <span>
                    {
                      leadArticle.readingTime
                    }{" "}
                    min
                  </span>
                </div>

              </div>

            </article>


            {/* SECONDARY */}

            <div className="economy-secondary">

              {secondaryArticles.map(
                (article) => (
                  <article
                    key={article.id}
                    className="economy-secondary__article"
                  >

                    <div>

                      <span className="economy-article-category">
                        {article.category}
                      </span>

                      <Link
                        to={`/noticia/${article.slug}`}
                      >
                        {article.title}
                      </Link>

                      <div className="economy-article-meta">
                        <span>
                          {
                            article
                              .readingTime
                          }{" "}
                          min
                        </span>
                      </div>

                    </div>


                    <Link
                      to={`/noticia/${article.slug}`}
                      className="economy-secondary__image"
                    >
                      <img
                        src={
                          article.image
                        }
                        alt=""
                      />
                    </Link>

                  </article>
                ),
              )}

            </div>

          </div>
        ) : (
          <div className="economy-empty">
            <strong>
              Sin publicaciones económicas
            </strong>

            <span>
              Los artículos clasificados
              como Economía aparecerán
              aquí.
            </span>
          </div>
        )}

      </section>


      {/* ===================================================
          INTELLIGENCE
          =================================================== */}

      <section className="economy-intelligence">

        <div className="economy-section-heading">

          <div>
            <span>
              SEGUIMIENTO
            </span>

            <h2>
              Acontecimientos económicos
            </h2>
          </div>

        </div>


        <div className="economy-story-list">

          {economyStories.length > 0 ? (
            economyStories.map(
              (story) => (
                <article
                  key={story.id}
                  className="economy-story"
                >

                  <div
                    className={
                      `economy-story__relevance economy-story__relevance--${story.relevance}`
                    }
                  />


                  <div className="economy-story__content">

                    <div className="economy-story__meta">

                      <span>
                        {story.territories
                          .map(
                            (
                              territory,
                            ) =>
                              territory.name,
                          )
                          .join(" · ")}
                      </span>

                      {story.location && (
                        <>
                          <span>
                            /
                          </span>

                          <span>
                            {
                              story.location
                                .name
                            }
                          </span>
                        </>
                      )}

                    </div>


                    <h3>
                      {story.title}
                    </h3>

                    <p>
                      {story.summary}
                    </p>

                  </div>


                  <div className="economy-story__status">

                    <span>
                      {story.relevance ===
                      "high"
                        ? "Alta"
                        : story.relevance ===
                            "medium"
                          ? "Media"
                          : "Seguimiento"}
                    </span>

                    <time>
                      {new Intl.DateTimeFormat(
                        "es-MX",
                        {
                          day: "numeric",
                          month: "short",
                        },
                      ).format(
                        new Date(
                          story.updatedAt,
                        ),
                      )}
                    </time>

                  </div>

                </article>
              ),
            )
          ) : (
            <div className="economy-empty">
              <strong>
                Sin acontecimientos
              </strong>

              <span>
                Las Stories del sector
                economy aparecerán aquí.
              </span>
            </div>
          )}

        </div>

      </section>

    </main>
  );
}