import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  mockArticles,
} from "../../features/news/data/mockArticles";

import {
  mockStories,
} from "../../features/stories/data/mockStories";

import "./AnalysisPage.css";


type AnalysisFilter =
  | "all"
  | "Geopolítica"
  | "Economía"
  | "Mercados"
  | "Tecnología"
  | "Energía";


const filters: {
  id: AnalysisFilter;
  label: string;
}[] = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "Geopolítica",
    label: "Geopolítica",
  },
  {
    id: "Economía",
    label: "Economía",
  },
  {
    id: "Mercados",
    label: "Mercados",
  },
  {
    id: "Tecnología",
    label: "Tecnología",
  },
  {
    id: "Energía",
    label: "Energía",
  },
];


function formatDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(date));
}


export function AnalysisPage() {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState<AnalysisFilter>(
    "all",
  );


  const analyses =
    useMemo(
      () =>
        mockArticles.filter(
          (article) =>
            article.type ===
            "analysis",
        ),
      [],
    );


  const filteredAnalyses =
    useMemo(() => {
      if (
        activeFilter === "all"
      ) {
        return analyses;
      }

      return analyses.filter(
        (article) =>
          article.category ===
          activeFilter,
      );
    }, [
      analyses,
      activeFilter,
    ]);


  const featuredAnalysis =
    filteredAnalyses[0];


  const latestAnalyses =
    filteredAnalyses.slice(
      1,
      4,
    );


  const archive =
    filteredAnalyses.slice(4);


  const analysisStories =
    useMemo(
      () =>
        mockStories
          .filter(
            (story) =>
              story.articleIds.some(
                (articleId) =>
                  analyses.some(
                    (article) =>
                      article.id ===
                      articleId,
                  ),
              ),
          )
          .slice(0, 4),
      [analyses],
    );


  return (
    <main className="analysis-page">

      {/* HEADER */}

      <header className="analysis-header">

        <div>
          <span className="analysis-header__eyebrow">
            SANPER / EDITORIAL
          </span>

          <h1>
            Análisis
          </h1>

          <p>
            Contexto, interpretación y
            perspectivas para entender
            los acontecimientos detrás
            de los titulares.
          </p>
        </div>


        <div className="analysis-header__mark">
          <span>
            A
          </span>

          <div>
            <strong>
              Análisis SanPer
            </strong>

            <small>
              Contexto antes que ruido
            </small>
          </div>
        </div>

      </header>


      {/* FILTERS */}

      <nav className="analysis-filters">

        {filters.map(
          (filter) => (
            <button
              key={filter.id}
              type="button"
              className={
                activeFilter ===
                filter.id
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setActiveFilter(
                  filter.id,
                )
              }
            >
              {filter.label}
            </button>
          ),
        )}

      </nav>


      {featuredAnalysis ? (
        <>
          {/* FEATURED */}

          <section className="analysis-featured">

            <Link
              to={`/noticia/${featuredAnalysis.slug}`}
              className="analysis-featured__image"
            >
              <img
                src={
                  featuredAnalysis.image
                }
                alt=""
              />
            </Link>


            <div className="analysis-featured__content">

              <span className="analysis-category">
                {
                  featuredAnalysis.category
                }
              </span>


              <Link
                to={`/noticia/${featuredAnalysis.slug}`}
                className="analysis-featured__title"
              >
                {
                  featuredAnalysis.title
                }
              </Link>


              {featuredAnalysis.subtitle && (
                <p className="analysis-featured__subtitle">
                  {
                    featuredAnalysis.subtitle
                  }
                </p>
              )}


              <p className="analysis-featured__excerpt">
                {
                  featuredAnalysis.excerpt
                }
              </p>


              <div className="analysis-featured__meta">

                <div className="analysis-author-avatar">
                  {
                    featuredAnalysis
                      .author.name
                      .charAt(0)
                      .toUpperCase()
                  }
                </div>

                <div>
                  <strong>
                    {
                      featuredAnalysis
                        .author.name
                    }
                  </strong>

                  <span>
                    {formatDate(
                      featuredAnalysis
                        .publishedAt,
                    )}

                    {" · "}

                    {
                      featuredAnalysis
                        .readingTime
                    }{" "}
                    min de lectura
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* LATEST */}

          {latestAnalyses.length >
            0 && (
            <section className="analysis-latest">

              <SectionHeading
                eyebrow="PERSPECTIVAS"
                title="Últimos análisis"
              />


              <div className="analysis-latest__grid">

                {latestAnalyses.map(
                  (article) => (
                    <article
                      key={article.id}
                      className="analysis-card"
                    >

                      <Link
                        to={`/noticia/${article.slug}`}
                        className="analysis-card__image"
                      >
                        <img
                          src={
                            article.image
                          }
                          alt=""
                        />
                      </Link>


                      <span className="analysis-category">
                        {
                          article.category
                        }
                      </span>


                      <Link
                        to={`/noticia/${article.slug}`}
                        className="analysis-card__title"
                      >
                        {article.title}
                      </Link>


                      <p>
                        {article.excerpt}
                      </p>


                      <div className="analysis-card__meta">
                        <span>
                          {
                            article.author
                              .name
                          }
                        </span>

                        <span>
                          {
                            article
                              .readingTime
                          }{" "}
                          min
                        </span>
                      </div>

                    </article>
                  ),
                )}

              </div>

            </section>
          )}


          {/* STORIES */}

          {analysisStories.length >
            0 && (
            <section className="analysis-context">

              <div className="analysis-context__intro">

                <span>
                  CONTEXTO
                </span>

                <h2>
                  Historias bajo análisis
                </h2>

                <p>
                  Acontecimientos que
                  requieren seguimiento
                  más allá del ciclo
                  inmediato de noticias.
                </p>

              </div>


              <div className="analysis-context__stories">

                {analysisStories.map(
                  (
                    story,
                    index,
                  ) => (
                    <article
                      key={story.id}
                      className="analysis-story"
                    >

                      <span className="analysis-story__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>


                      <div>

                        <div className="analysis-story__meta">

                          <span>
                            {story.territories
                              .map(
                                (
                                  territory,
                                ) =>
                                  territory.name,
                              )
                              .join(
                                " · ",
                              )}
                          </span>

                          <span>
                            {
                              story
                                .relevance
                            }
                          </span>

                        </div>


                        <h3>
                          {story.title}
                        </h3>

                        <p>
                          {story.summary}
                        </p>

                      </div>

                    </article>
                  ),
                )}

              </div>

            </section>
          )}


          {/* ARCHIVE */}

          <section className="analysis-archive">

            <SectionHeading
              eyebrow="ARCHIVO"
              title="Más análisis"
            />


            {archive.length >
            0 ? (
              <div className="analysis-archive__list">

                {archive.map(
                  (article) => (
                    <article
                      key={article.id}
                      className="analysis-archive__item"
                    >

                      <div className="analysis-archive__date">
                        {formatDate(
                          article
                            .publishedAt,
                        )}
                      </div>


                      <div className="analysis-archive__content">

                        <span className="analysis-category">
                          {
                            article.category
                          }
                        </span>

                        <Link
                          to={`/noticia/${article.slug}`}
                        >
                          {
                            article.title
                          }
                        </Link>

                        <p>
                          {
                            article.excerpt
                          }
                        </p>

                      </div>


                      <div className="analysis-archive__time">
                        {
                          article
                            .readingTime
                        }{" "}
                        min
                      </div>

                    </article>
                  ),
                )}

              </div>
            ) : (
              <div className="analysis-archive__end">
                <span>
                  Has llegado al final
                  de los análisis
                  disponibles.
                </span>
              </div>
            )}

          </section>
        </>
      ) : (
        <div className="analysis-empty">

          <strong>
            Todavía no hay análisis
            en esta categoría
          </strong>

          <span>
            Los artículos con
            type="analysis" aparecerán
            automáticamente aquí.
          </span>

        </div>
      )}

    </main>
  );
}


interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}


function SectionHeading({
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <header className="analysis-section-heading">

      <span>
        {eyebrow}
      </span>

      <h2>
        {title}
      </h2>

    </header>
  );
}