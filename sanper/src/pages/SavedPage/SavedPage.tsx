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
  mockSavedArticles,
  mockSavedCollections,
} from "../../features/saved/data/mockSavedArticles";

import "./SavedPage.css";

type SavedFilter =
  | "all"
  | "articles"
  | "collections";

function formatSavedDate(
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

export function SavedPage() {
  const [filter, setFilter] =
    useState<SavedFilter>("all");

  const [search, setSearch] =
    useState("");

  const savedArticles = useMemo(
    () =>
      mockSavedArticles
        .map((saved) => {
          const article =
            mockArticles.find(
              (item) =>
                item.id ===
                saved.articleId,
            );

          if (!article) {
            return null;
          }

          return {
            ...saved,
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
        .filter((item) => {
          const query =
            search
              .trim()
              .toLowerCase();

          if (!query) {
            return true;
          }

          return (
            item.article.title
              .toLowerCase()
              .includes(query) ||
            item.article.excerpt
              .toLowerCase()
              .includes(query)
          );
        }),
    [search],
  );

  return (
    <main className="saved-page">

      <header className="saved-header">
        <div>
          <span className="saved-header__eyebrow">
            BIBLIOTECA
          </span>

          <h1>
            Guardados
          </h1>

          <p>
            Noticias, análisis e historias
            que quieres conservar para
            después.
          </p>
        </div>

        <div className="saved-header__count">
          <strong>
            {savedArticles.length}
          </strong>

          <span>
            elementos guardados
          </span>
        </div>
      </header>


      <div className="saved-toolbar">

        <nav className="saved-filters">
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
              filter === "articles"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setFilter("articles")
            }
          >
            Artículos
          </button>

          <button
            type="button"
            className={
              filter === "collections"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setFilter("collections")
            }
          >
            Colecciones
          </button>
        </nav>


        <div className="saved-search">
          <span aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            placeholder="Buscar en guardados"
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
          />
        </div>

      </div>


      {(filter === "all" ||
        filter === "collections") && (
        <section className="saved-section">

          <div className="saved-section__heading">
            <div>
              <span>
                COLECCIONES
              </span>

              <h2>
                Tu biblioteca
              </h2>
            </div>

            <button type="button">
              + Nueva colección
            </button>
          </div>


          <div className="saved-collections">

            {mockSavedCollections.map(
              (collection) => {
                const count =
                  mockSavedArticles.filter(
                    (saved) =>
                      saved.collectionId ===
                      collection.id,
                  ).length;

                return (
                  <button
                    key={collection.id}
                    type="button"
                    className="saved-collection"
                  >
                    <div className="saved-collection__visual">
                      <span>
                        {collection.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="saved-collection__info">
                      <strong>
                        {collection.name}
                      </strong>

                      <span>
                        {count}{" "}
                        {count === 1
                          ? "artículo"
                          : "artículos"}
                      </span>
                    </div>

                    <span
                      className="saved-collection__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                );
              },
            )}

          </div>
        </section>
      )}


      {(filter === "all" ||
        filter === "articles") && (
        <section className="saved-section saved-section--articles">

          <div className="saved-section__heading">
            <div>
              <span>
                LECTURA
              </span>

              <h2>
                Artículos guardados
              </h2>
            </div>
          </div>


          {savedArticles.length > 0 ? (
            <div className="saved-articles">

              {savedArticles.map(
                ({
                  article,
                  savedAt,
                }) => (
                  <article
                    key={article.id}
                    className="saved-article"
                  >

                    <Link
                      to={`/noticia/${article.slug}`}
                      className="saved-article__image"
                    >
                      <img
                        src={article.image}
                        alt=""
                      />
                    </Link>


                    <div className="saved-article__content">

                      <div className="saved-article__meta">
                        <span>
                          {article.category}
                        </span>

                        <span
                          aria-hidden="true"
                        >
                          ·
                        </span>

                        <span>
                          Guardado{" "}
                          {formatSavedDate(
                            savedAt,
                          )}
                        </span>
                      </div>


                      <Link
                        to={`/noticia/${article.slug}`}
                        className="saved-article__title"
                      >
                        {article.title}
                      </Link>


                      <p>
                        {article.excerpt}
                      </p>


                      <div className="saved-article__footer">
                        <span>
                          {
                            article
                              .readingTime
                          }{" "}
                          min de lectura
                        </span>

                        <button
                          type="button"
                          aria-label="Quitar de guardados"
                        >
                          Guardado
                          <span
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        </button>
                      </div>

                    </div>
                  </article>
                ),
              )}

            </div>
          ) : (
            <div className="saved-empty">
              <strong>
                No encontramos resultados
              </strong>

              <span>
                Prueba con otra búsqueda.
              </span>
            </div>
          )}

        </section>
      )}

    </main>
  );
}