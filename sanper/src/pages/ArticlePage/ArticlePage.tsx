import { useParams } from "react-router-dom";

import { mockArticles } from
  "../../features/news/data/mockArticles";
  import { mockStories } from
  "../../features/stories/data/mockStories";

import { SectorBadge } from
  "../../features/stories/components/SectorBadge/SectorBadge";
import "./ArticlePage.css";

function formatArticleDate(
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

function formatImportance(
  importance:
    | "local"
    | "national"
    | "regional"
    | "international"
    | "global",
) {
  const labels = {
    local: "Local",
    national: "Nacional",
    regional: "Regional",
    international:
      "Internacional",
    global: "Global",
  };

  return labels[importance];
}

function formatRelevance(
  relevance:
    | "high"
    | "medium"
    | "monitoring",
) {
  const labels = {
    high: "Alta",
    medium: "Media",
    monitoring:
      "Seguimiento",
  };

  return labels[relevance];
}

export function ArticlePage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const article =
    mockArticles.find(
      (item) =>
        item.slug === slug,
    );


const story =
  article?.storyId
    ? mockStories.find(
        (item) =>
          item.id ===
          article.storyId,
      )
    : undefined;




  if (!article) {
    return (
      <main className="article-page">
        <div className="article-page__not-found">
          <span>404</span>

          <h1>
            Artículo no encontrado
          </h1>

          <p>
            El artículo que buscas no existe
            o ya no está disponible.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="article-page">
      <article className="article">
        <header className="article__header">
          <div className="article__eyebrow">
            <span>
              {article.category}
            </span>

            <span
              className="article__eyebrow-separator"
              aria-hidden="true"
            />

            <span>
              {article.type === "analysis"
                ? "Análisis"
                : article.type === "explainer"
                  ? "Explicador"
                  : "Noticias"}
            </span>
          </div>

          <h1 className="article__title">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="article__subtitle">
              {article.subtitle}
            </p>
          )}

          <div className="article__meta">
            <div className="article__author">
              {article.author.avatar ? (
                <img
                  className="article__author-avatar"
                  src={
                    article.author.avatar
                  }
                  alt=""
                />
              ) : (
                <div
                  className="article__author-placeholder"
                  aria-hidden="true"
                >
                  {article.author.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <strong>
                  {article.author.name}
                </strong>

                {article.author.role && (
                  <span>
                    {article.author.role}
                  </span>
                )}
              </div>
            </div>

            <div className="article__publication">
              <span>
                {formatArticleDate(
                  article.publishedAt,
                )}
              </span>

              <span aria-hidden="true">
                ·
              </span>

              <span>
                {article.readingTime} min
                de lectura
              </span>

              {article.updatedAt && (
                <>
                  <span aria-hidden="true">
                    ·
                  </span>

                  <span>
                    Actualizado
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        <figure className="article__hero">
          <img
            src={article.image}
            alt={article.title}
          />

          {article.imageCaption && (
            <figcaption>
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        <div className="article__layout">
          <aside className="article__share">
            <span>Compartir</span>

            <button
              type="button"
              aria-label="Copiar enlace"
            >
              ↗
            </button>
          </aside>

          <div className="article__body">
            {article.sections.map(
              (section) => (
                <section
                  key={section.id}
                  className="article__section"
                >
                  {section.heading && (
                    <h2>
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs.map(
                    (
                      paragraph,
                      index,
                    ) => (
                      <p
                        key={`${section.id}-${index}`}
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </section>
              ),
            )}
          </div>

          <aside className="article__sidebar">
  {story ? (
    <div className="article__context">
      <span className="article__context-label">
        CONTEXTO
      </span>

      <div className="article__context-section">
        <span className="article__context-heading">
          Sectores
        </span>

        <div className="article__sectors">
          {story.sectors.map(
            (sector) => (
              <SectorBadge
                key={sector}
                sector={sector}
              />
            ),
          )}
        </div>
      </div>

      <div className="article__context-section">
        <span className="article__context-heading">
          Territorios
        </span>

        <div className="article__territories">
          {story.territories.map(
            (territory) => (
              <div
                key={territory.code}
                className="article__territory"
              >
                <span className="article__territory-code">
                  {territory.code}
                </span>

                <span>
                  {territory.name}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="article__context-section">
        <div className="article__context-row">
          <span>Importancia</span>

          <strong>
            {formatImportance(
              story.importance,
            )}
          </strong>
        </div>

        <div className="article__context-row">
          <span>Relevancia</span>

          <strong>
            {formatRelevance(
              story.relevance,
            )}
          </strong>
        </div>
      </div>

      {story.location && (
        <div className="article__context-section">
          <span className="article__context-heading">
            Ubicación
          </span>

          <strong className="article__location">
            {story.location.name}
          </strong>
        </div>
      )}

      <div className="article__story-status">
        <span
          className="article__story-dot"
          aria-hidden="true"
        />

        Historia en seguimiento
      </div>
    </div>
  ) : (
    <div className="article__context">
      <span className="article__context-label">
        SOBRE ESTE ARTÍCULO
      </span>

      <div className="article__context-row">
        <span>Categoría</span>

        <strong>
          {article.category}
        </strong>
      </div>

      <div className="article__context-row">
        <span>Lectura</span>

        <strong>
          {article.readingTime} min
        </strong>
      </div>
    </div>
  )}
</aside>
        </div>
      </article>
    </main>
  );
}