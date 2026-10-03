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

import "./GeopoliticsPage.css";


const strategicAreas = [
  {
    id: "conflicts",
    label: "Conflictos",
    value: "SEGURIDAD",
    detail:
      "Conflictos · tensiones · defensa",
  },
  {
    id: "diplomacy",
    label: "Diplomacia",
    value: "PODER",
    detail:
      "Alianzas · negociaciones · influencia",
  },
  {
    id: "sanctions",
    label: "Sanciones",
    value: "PRESIÓN",
    detail:
      "Comercio · restricciones · activos",
  },
  {
    id: "routes",
    label: "Rutas estratégicas",
    value: "FLUJOS",
    detail:
      "Estrechos · puertos · corredores",
  },
];


function formatDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "numeric",
      month: "short",
    },
  ).format(new Date(date));
}


export function GeopoliticsPage() {
  const geopoliticalStories =
    useMemo(
      () =>
        mockStories.filter(
          (story) =>
            story.sectors.includes(
              "geopolitics",
            ),
        ),
      [],
    );


  const geopoliticalArticles =
    useMemo(
      () =>
        mockArticles.filter(
          (article) =>
            article.category ===
            "Geopolítica",
        ),
      [],
    );


  const leadArticle =
    geopoliticalArticles[0];

  const secondaryArticles =
    geopoliticalArticles.slice(
      1,
      4,
    );


  const highPriorityStories =
    geopoliticalStories.filter(
      (story) =>
        story.relevance === "high",
    );


  return (
    <main className="geopolitics-page">

      {/* HEADER */}

      <header className="geopolitics-header">

        <div>
          <span className="geopolitics-header__eyebrow">
            SANPER / GEOPOLÍTICA
          </span>

          <h1>
            Geopolítica
          </h1>

          <p>
            Poder, conflictos,
            diplomacia y movimientos
            estratégicos que modifican
            el equilibrio internacional.
          </p>
        </div>


        <div className="geopolitics-header__status">

          <span className="geopolitics-header__pulse" />

          <div>
            <strong>
              Seguimiento global
            </strong>

            <span>
              {
                highPriorityStories.length
              }{" "}
              acontecimientos prioritarios
            </span>
          </div>

        </div>

      </header>


      {/* STRATEGIC AREAS */}

      <section className="geopolitics-areas">

        {strategicAreas.map(
          (area) => (
            <article
              key={area.id}
              className="geopolitics-area"
            >

              <span className="geopolitics-area__label">
                {area.label}
              </span>

              <strong>
                {area.value}
              </strong>

              <span className="geopolitics-area__detail">
                {area.detail}
              </span>

            </article>
          ),
        )}

      </section>


      {/* WORLD MAP */}

      <section className="geopolitics-map">

        <div className="geopolitics-section-heading">

          <div>
            <span>
              SITUACIÓN GLOBAL
            </span>

            <h2>
              Mapa geopolítico
            </h2>
          </div>


          <div className="geopolitics-map__legend">

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


        <div className="geopolitics-map__canvas">

          <WorldMap
            stories={
              geopoliticalStories
            }
          />

        </div>

      </section>


      {/* CURRENT SITUATIONS */}

      <section className="geopolitics-situations">

        <div className="geopolitics-section-heading">

          <div>
            <span>
              SEGUIMIENTO
            </span>

            <h2>
              Situaciones activas
            </h2>
          </div>

          <span className="geopolitics-section-count">
            {
              geopoliticalStories.length
            }{" "}
            historias
          </span>

        </div>


        <div className="geopolitics-situation-list">

          {geopoliticalStories.length >
          0 ? (
            geopoliticalStories.map(
              (story) => (
                <article
                  key={story.id}
                  className="geopolitics-situation"
                >

                  <div
                    className={
                      `geopolitics-situation__signal geopolitics-situation__signal--${story.relevance}`
                    }
                  />


                  <div className="geopolitics-situation__main">

                    <div className="geopolitics-situation__meta">

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
                          <span>/</span>

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


                    <div className="geopolitics-situation__sectors">

                      {story.sectors.map(
                        (sector) => (
                          <span
                            key={sector}
                          >
                            {sector}
                          </span>
                        ),
                      )}

                    </div>

                  </div>


                  <div className="geopolitics-situation__aside">

                    <strong>
                      {story.relevance ===
                      "high"
                        ? "Alta"
                        : story.relevance ===
                            "medium"
                          ? "Media"
                          : "Seguimiento"}
                    </strong>

                    <span>
                      relevancia
                    </span>

                    <time>
                      {formatDate(
                        story.updatedAt,
                      )}
                    </time>

                  </div>

                </article>
              ),
            )
          ) : (
            <GeopoliticsEmpty
              title="Sin situaciones activas"
              description="Las Stories clasificadas como geopolitics aparecerán aquí."
            />
          )}

        </div>

      </section>


      {/* EDITORIAL */}

      <section className="geopolitics-editorial">

        <div className="geopolitics-section-heading">

          <div>
            <span>
              EDITORIAL
            </span>

            <h2>
              Geopolítica ahora
            </h2>
          </div>

        </div>


        {leadArticle ? (
          <div className="geopolitics-news-layout">

            <article className="geopolitics-lead">

              <Link
                to={`/noticia/${leadArticle.slug}`}
                className="geopolitics-lead__image"
              >
                <img
                  src={leadArticle.image}
                  alt=""
                />
              </Link>


              <div className="geopolitics-lead__content">

                <span className="geopolitics-article-category">
                  {
                    leadArticle.category
                  }
                </span>


                <Link
                  to={`/noticia/${leadArticle.slug}`}
                  className="geopolitics-lead__title"
                >
                  {leadArticle.title}
                </Link>


                <p>
                  {leadArticle.excerpt}
                </p>


                <div className="geopolitics-article-meta">

                  <span>
                    {
                      leadArticle.author
                        .name
                    }
                  </span>

                  <span>·</span>

                  <span>
                    {
                      leadArticle
                        .readingTime
                    }{" "}
                    min
                  </span>

                </div>

              </div>

            </article>


            <div className="geopolitics-secondary">

              {secondaryArticles.map(
                (article) => (
                  <article
                    key={article.id}
                    className="geopolitics-secondary__article"
                  >

                    <div>

                      <span className="geopolitics-article-category">
                        {
                          article.category
                        }
                      </span>

                      <Link
                        to={`/noticia/${article.slug}`}
                      >
                        {article.title}
                      </Link>

                      <div className="geopolitics-article-meta">
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
                      className="geopolitics-secondary__image"
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
          <GeopoliticsEmpty
            title="Sin publicaciones geopolíticas"
            description="Los artículos clasificados como Geopolítica aparecerán aquí."
          />
        )}

      </section>


      {/* STRATEGIC LENS */}

      <section className="geopolitics-lens">

        <div className="geopolitics-lens__intro">

          <span>
            LENTE SANPER
          </span>

          <h2>
            Qué observamos
          </h2>

          <p>
            La geopolítica no ocurre de
            forma aislada. Seguimos cómo
            poder, recursos, tecnología
            y economía se conectan.
          </p>

        </div>


        <div className="geopolitics-lens__grid">

          <article>
            <span>01</span>

            <strong>
              Poder y alianzas
            </strong>

            <p>
              Cambios en relaciones
              diplomáticas, bloques y
              alianzas estratégicas.
            </p>
          </article>


          <article>
            <span>02</span>

            <strong>
              Conflictos
            </strong>

            <p>
              Escaladas, negociaciones,
              seguridad y cambios en el
              terreno.
            </p>
          </article>


          <article>
            <span>03</span>

            <strong>
              Recursos
            </strong>

            <p>
              Energía, materias primas,
              rutas comerciales e
              infraestructura crítica.
            </p>
          </article>


          <article>
            <span>04</span>

            <strong>
              Poder económico
            </strong>

            <p>
              Sanciones, comercio,
              tecnología y herramientas
              de presión económica.
            </p>
          </article>

        </div>

      </section>

    </main>
  );
}


interface GeopoliticsEmptyProps {
  title: string;
  description: string;
}


function GeopoliticsEmpty({
  title,
  description,
}: GeopoliticsEmptyProps) {
  return (
    <div className="geopolitics-empty">

      <strong>
        {title}
      </strong>

      <span>
        {description}
      </span>

    </div>
  );
}