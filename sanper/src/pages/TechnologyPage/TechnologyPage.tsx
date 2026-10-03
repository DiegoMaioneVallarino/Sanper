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

import "./TechnologyPage.css";


const technologyAreas = [
  {
    id: "ai",
    label: "Inteligencia artificial",
    value: "IA",
    detail: "Modelos · agentes · infraestructura",
  },
  {
    id: "chips",
    label: "Semiconductores",
    value: "CHIPS",
    detail: "Fabricación · diseño · suministro",
  },
  {
    id: "cloud",
    label: "Infraestructura",
    value: "CLOUD",
    detail: "Compute · centros de datos",
  },
  {
    id: "cyber",
    label: "Ciberseguridad",
    value: "CYBER",
    detail: "Seguridad · redes · riesgo",
  },
];


export function TechnologyPage() {
  const technologyStories =
    useMemo(
      () =>
        mockStories.filter(
          (story) =>
            story.sectors.includes(
              "technology",
            ),
        ),
      [],
    );


  const technologyArticles =
    useMemo(
      () =>
        mockArticles.filter(
          (article) =>
            article.category ===
            "Tecnología",
        ),
      [],
    );


  const leadArticle =
    technologyArticles[0];

  const secondaryArticles =
    technologyArticles.slice(
      1,
      4,
    );


  return (
    <main className="technology-page">

      {/* HEADER */}

      <header className="technology-header">

        <div>
          <span className="technology-header__eyebrow">
            SANPER / TECNOLOGÍA
          </span>

          <h1>
            Tecnología
          </h1>

          <p>
            Inteligencia artificial,
            semiconductores,
            infraestructura digital y
            las tecnologías que están
            transformando la economía
            global.
          </p>
        </div>


        <div className="technology-header__status">

          <span className="technology-header__pulse" />

          <div>
            <strong>
              Ecosistema tecnológico
            </strong>

            <span>
              Seguimiento global
            </span>
          </div>

        </div>

      </header>


      {/* AREAS */}

      <section className="technology-areas">

        {technologyAreas.map(
          (area) => (
            <article
              key={area.id}
              className="technology-area"
            >

              <span className="technology-area__label">
                {area.label}
              </span>

              <strong>
                {area.value}
              </strong>

              <span className="technology-area__detail">
                {area.detail}
              </span>

            </article>
          ),
        )}

      </section>


      {/* MAP */}

      <section className="technology-map">

        <div className="technology-section-heading">

          <div>
            <span>
              ACTIVIDAD TECNOLÓGICA
            </span>

            <h2>
              Tecnología mundial
            </h2>
          </div>


          <div className="technology-map__legend">

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


        <div className="technology-map__canvas">

          <WorldMap
            stories={
              technologyStories
            }
          />

        </div>

      </section>


      {/* EDITORIAL */}

      <section className="technology-editorial">

        <div className="technology-section-heading">

          <div>
            <span>
              EDITORIAL
            </span>

            <h2>
              Tecnología ahora
            </h2>
          </div>

        </div>


        {leadArticle ? (
          <div className="technology-news-layout">

            <article className="technology-lead">

              <Link
                to={`/noticia/${leadArticle.slug}`}
                className="technology-lead__image"
              >
                <img
                  src={leadArticle.image}
                  alt=""
                />
              </Link>


              <div className="technology-lead__content">

                <span className="technology-article-category">
                  {
                    leadArticle.category
                  }
                </span>


                <Link
                  to={`/noticia/${leadArticle.slug}`}
                  className="technology-lead__title"
                >
                  {leadArticle.title}
                </Link>


                <p>
                  {leadArticle.excerpt}
                </p>


                <div className="technology-article-meta">

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


            <div className="technology-secondary">

              {secondaryArticles.map(
                (article) => (
                  <article
                    key={article.id}
                    className="technology-secondary__article"
                  >

                    <div>

                      <span className="technology-article-category">
                        {
                          article.category
                        }
                      </span>

                      <Link
                        to={`/noticia/${article.slug}`}
                      >
                        {article.title}
                      </Link>

                      <div className="technology-article-meta">
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
                      className="technology-secondary__image"
                    >
                      <img
                        src={article.image}
                        alt=""
                      />
                    </Link>

                  </article>
                ),
              )}

            </div>

          </div>
        ) : (
          <TechnologyEmpty
            title="Sin publicaciones tecnológicas"
            description="Los artículos clasificados como Tecnología aparecerán aquí."
          />
        )}

      </section>


      {/* INTELLIGENCE */}

      <section className="technology-intelligence">

        <div className="technology-section-heading">

          <div>
            <span>
              INTELIGENCIA
            </span>

            <h2>
              Acontecimientos tecnológicos
            </h2>
          </div>

        </div>


        <div className="technology-story-list">

          {technologyStories.length >
          0 ? (
            technologyStories.map(
              (story) => (
                <article
                  key={story.id}
                  className="technology-story"
                >

                  <div
                    className={
                      `technology-story__relevance technology-story__relevance--${story.relevance}`
                    }
                  />


                  <div className="technology-story__content">

                    <div className="technology-story__meta">

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

                  </div>


                  <div className="technology-story__status">

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
            <TechnologyEmpty
              title="Sin acontecimientos"
              description="Las Stories del sector technology aparecerán aquí."
            />
          )}

        </div>

      </section>


      {/* TECHNOLOGY LENS */}

      <section className="technology-lens">

        <div className="technology-lens__intro">

          <span>
            LENTE SANPER
          </span>

          <h2>
            Lo que seguimos
          </h2>

          <p>
            Las áreas tecnológicas con
            impacto económico,
            geopolítico y estratégico.
          </p>

        </div>


        <div className="technology-lens__grid">

          <article>
            <span>01</span>
            <strong>
              Inteligencia artificial
            </strong>
            <p>
              Modelos, agentes,
              infraestructura,
              adopción y regulación.
            </p>
          </article>


          <article>
            <span>02</span>
            <strong>
              Semiconductores
            </strong>
            <p>
              Fabricación, cadenas de
              suministro y capacidad
              computacional.
            </p>
          </article>


          <article>
            <span>03</span>
            <strong>
              Infraestructura
            </strong>
            <p>
              Centros de datos,
              telecomunicaciones,
              nube y redes.
            </p>
          </article>


          <article>
            <span>04</span>
            <strong>
              Poder tecnológico
            </strong>
            <p>
              Empresas, gobiernos y
              tecnologías estratégicas
              que modifican el equilibrio
              global.
            </p>
          </article>

        </div>

      </section>

    </main>
  );
}


interface TechnologyEmptyProps {
  title: string;
  description: string;
}


function TechnologyEmpty({
  title,
  description,
}: TechnologyEmptyProps) {
  return (
    <div className="technology-empty">

      <strong>
        {title}
      </strong>

      <span>
        {description}
      </span>

    </div>
  );
}