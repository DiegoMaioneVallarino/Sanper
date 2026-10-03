import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  mockComments,
} from "../../features/community/data/mockComments";

import {
  mockArticles,
} from "../../features/news/data/mockArticles";

import "./CommunityPage.css";


type CommunityFilter =
  | "all"
  | "opinions"
  | "discussions";


function formatCommunityDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(new Date(date));
}


export function CommunityPage() {
  const [
    filter,
    setFilter,
  ] = useState<CommunityFilter>(
    "all",
  );


  const publications =
    useMemo(() => {
      return mockComments
        .map((comment) => {
          const article =
            mockArticles.find(
              (item) =>
                item.id ===
                comment.articleId,
            );

          if (!article) {
            return null;
          }

          return {
            comment,
            article,
          };
        })
        .filter(
          (
            item,
          ): item is NonNullable<
            typeof item
          > => item !== null,
        )
        .filter(({ comment }) => {
          if (
            filter ===
            "opinions"
          ) {
            return (
              comment.type ===
              "opinion"
            );
          }

          if (
            filter ===
            "discussions"
          ) {
            return (
              comment.type ===
              "comment"
            );
          }

          return true;
        });
    }, [filter]);


  const opinions =
    publications.filter(
      ({ comment }) =>
        comment.type ===
        "opinion",
    );


  const discussions =
    publications.filter(
      ({ comment }) =>
        comment.type ===
        "comment",
    );


  return (
    <main className="community-page">

      {/* HEADER */}

      <header className="community-header">
        <div>
          <span className="community-header__eyebrow">
            SANPER
          </span>

          <h1>
            Comunidad
          </h1>

          <p>
            Opiniones y conversaciones
            alrededor de las historias
            que están moviendo al mundo.
          </p>
        </div>

        <div className="community-header__stats">
          <div>
            <strong>
              {opinions.length}
            </strong>

            <span>
              opiniones
            </span>
          </div>

          <div>
            <strong>
              {discussions.length}
            </strong>

            <span>
              comentarios
            </span>
          </div>
        </div>
      </header>


      {/* NAV */}

      <div className="community-toolbar">

        <nav className="community-filters">
          <button
            type="button"
            className={
              filter === "all"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setFilter("all")
            }
          >
            Todo
          </button>

          <button
            type="button"
            className={
              filter ===
              "opinions"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setFilter(
                "opinions",
              )
            }
          >
            Opinión
          </button>

          <button
            type="button"
            className={
              filter ===
              "discussions"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setFilter(
                "discussions",
              )
            }
          >
            Conversaciones
          </button>
        </nav>

        <button
          type="button"
          className="community-write"
        >
          Escribir opinión
        </button>

      </div>


      {/* CONTENT */}

      <div className="community-layout">

        <section className="community-feed">

          {publications.length > 0 ? (
            publications.map(
              ({
                comment,
                article,
              }) => (
                <article
                  key={comment.id}
                  className={
                    comment.type ===
                    "opinion"
                      ? "community-post community-post--opinion"
                      : "community-post"
                  }
                >

                  {/* AUTHOR */}

                  <header className="community-post__header">

                    <div className="community-post__avatar">
                      {comment.author.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="community-post__author">
                      <div>
                        <strong>
                          {
                            comment
                              .author
                              .name
                          }
                        </strong>

                        {comment.type ===
                          "opinion" && (
                          <span className="community-post__badge">
                            Opinión
                          </span>
                        )}
                      </div>

                      <time>
                        {formatCommunityDate(
                          comment.createdAt,
                        )}
                      </time>
                    </div>

                  </header>


                  {/* POST */}

                  <div className="community-post__body">
                    <p>
                      {comment.content}
                    </p>
                  </div>


                  {/* RELATED STORY */}

                  <Link
                    to={`/noticia/${article.slug}`}
                    className="community-story"
                  >
                    <div className="community-story__content">

                      <span>
                        {
                          article.category
                        }
                      </span>

                      <strong>
                        {
                          article.title
                        }
                      </strong>

                    </div>

                    <div className="community-story__image">
                      <img
                        src={
                          article.image
                        }
                        alt=""
                      />
                    </div>
                  </Link>


                  {/* ACTIONS */}

                  <footer className="community-post__actions">

                    <button
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                      >
                        ↑
                      </span>

                      {comment.likes}
                    </button>

                    <button
                      type="button"
                    >
                      Responder
                    </button>

                    <button
                      type="button"
                    >
                      Compartir
                    </button>

                  </footer>

                </article>
              ),
            )
          ) : (
            <div className="community-empty">
              <strong>
                Todavía no hay
                publicaciones aquí
              </strong>

              <span>
                Las conversaciones de
                las noticias aparecerán
                en esta sección.
              </span>
            </div>
          )}

        </section>


        {/* SIDEBAR */}

        <aside className="community-sidebar">

          <section className="community-sidebar__section">
            <span className="community-sidebar__eyebrow">
              COMUNIDAD
            </span>

            <h2>
              Conversaciones activas
            </h2>

            {mockArticles
              .slice(0, 4)
              .map(
                (
                  article,
                  index,
                ) => (
                  <Link
                    key={
                      article.id
                    }
                    to={`/noticia/${article.slug}`}
                    className="community-trending"
                  >
                    <span>
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <div>
                      <strong>
                        {
                          article.title
                        }
                      </strong>

                      <small>
                        {
                          article.category
                        }
                      </small>
                    </div>
                  </Link>
                ),
              )}
          </section>


          <section className="community-sidebar__note">
            <span>
              SOBRE COMUNIDAD
            </span>

            <p>
              Comunidad conecta las
              opiniones de los lectores
              con las historias,
              artículos y acontecimientos
              que siguen en SanPer.
            </p>
          </section>

        </aside>

      </div>

    </main>
  );
}