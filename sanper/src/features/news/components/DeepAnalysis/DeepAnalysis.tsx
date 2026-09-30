import { Link } from "react-router-dom";

import { mockArticles } from "../../data/mockArticles";

import "./DeepAnalysis.css";

export function DeepAnalysis() {
  const analysisArticles = mockArticles.slice(4, 8);

  const mainArticle = analysisArticles[0];
  const secondaryArticles = analysisArticles.slice(1);

  if (!mainArticle) {
    return null;
  }

  return (
    <section className="deep-analysis">
      <header className="deep-analysis__header">
        <div>
          <span className="deep-analysis__eyebrow">
            Perspectiva
          </span>

          <h2 className="deep-analysis__heading">
            Análisis en profundidad
          </h2>
        </div>

        <Link
          className="deep-analysis__all"
          to="/analisis"
        >
          Ver análisis
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <Link
        className="deep-analysis__lead"
        to={`/noticia/${mainArticle.slug}`}
      >
        <div className="deep-analysis__lead-content">
          <span className="deep-analysis__category">
            {mainArticle.category}
          </span>

          <h3 className="deep-analysis__lead-title">
            {mainArticle.title}
          </h3>

          <p className="deep-analysis__lead-excerpt">
            {mainArticle.excerpt}
          </p>

          <div className="deep-analysis__meta">
            <span>
              {mainArticle.author.name}
            </span>

            <span>·</span>

            <span>
              {mainArticle.readingTime} min
            </span>
          </div>
        </div>

        <div className="deep-analysis__lead-media">
          <img
            src={mainArticle.image}
            alt=""
          />
        </div>
      </Link>

      <div className="deep-analysis__secondary">
        {secondaryArticles.map((article) => (
          <Link
            className="deep-analysis__article"
            key={article.id}
            to={`/noticia/${article.slug}`}
          >
            <span className="deep-analysis__category">
              {article.category}
            </span>

            <h3 className="deep-analysis__article-title">
              {article.title}
            </h3>

            <p className="deep-analysis__article-excerpt">
              {article.excerpt}
            </p>

            <div className="deep-analysis__meta">
              <span>
                {article.author.name}
              </span>

              <span>·</span>

              <span>
                {article.readingTime} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}