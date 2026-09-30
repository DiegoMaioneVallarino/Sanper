import { Link } from "react-router-dom";

import { mockArticles } from "../../data/mockArticles";

import "./LatestAnalysis.css";

export function LatestAnalysis() {
  const articles = [...mockArticles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime(),
    )
    .slice(0, 6);

  return (
    <section className="latest-analysis">
      <header className="latest-analysis__header">
        <div>
          <span className="latest-analysis__eyebrow">
            Actualidad
          </span>

          <h2 className="latest-analysis__heading">
            Últimos análisis
          </h2>
        </div>

        <Link
          className="latest-analysis__all"
          to="/analisis"
        >
          Ver todos
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="latest-analysis__content">
        <div className="latest-analysis__feed">
          {articles.map((article) => (
            <Link
              className="latest-analysis__item"
              key={article.id}
              to={`/noticia/${article.slug}`}
            >
              <time
                className="latest-analysis__time"
                dateTime={article.publishedAt}
              >
                {formatTime(article.publishedAt)}
              </time>

              <div className="latest-analysis__story">
                <div className="latest-analysis__story-top">
                  <span className="latest-analysis__category">
                    {article.category}
                  </span>

                  <span className="latest-analysis__reading">
                    {article.readingTime} min
                  </span>
                </div>

                <h3 className="latest-analysis__title">
                  {article.title}
                </h3>

                <p className="latest-analysis__excerpt">
                  {article.excerpt}
                </p>
              </div>

              <span
                className="latest-analysis__arrow"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        <aside className="latest-analysis__sidebar">
          <div className="latest-analysis__sidebar-section">
            <span className="latest-analysis__sidebar-label">
              En seguimiento
            </span>

            <h3 className="latest-analysis__sidebar-title">
              Temas que SanPer está siguiendo
            </h3>

            <div className="latest-analysis__topics">
              <Topic
                name="Competencia tecnológica"
                count={14}
              />

              <Topic
                name="Transición energética"
                count={9}
              />

              <Topic
                name="Comercio global"
                count={12}
              />

              <Topic
                name="Política monetaria"
                count={7}
              />

              <Topic
                name="Tensiones geopolíticas"
                count={18}
              />
            </div>
          </div>

          <div className="latest-analysis__pulse">
            <span className="latest-analysis__pulse-indicator" />

            <div>
              <strong>Monitoreo global activo</strong>

              <span>
                Seguimiento de acontecimientos,
                mercados y fuentes.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

interface TopicProps {
  name: string;
  count: number;
}

function Topic({
  name,
  count,
}: TopicProps) {
  return (
    <Link
      className="latest-analysis__topic"
      to="/global"
    >
      <span>{name}</span>

      <span className="latest-analysis__topic-count">
        {count}
      </span>
    </Link>
  );
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}