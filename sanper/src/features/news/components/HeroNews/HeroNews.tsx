import { Link } from "react-router-dom";

import { mockArticles } from "../../data/mockArticles";

import "./HeroNews.css";

export function HeroNews() {
  const featuredArticle =
    mockArticles.find((article) => article.featured) ??
    mockArticles[0];

  const secondaryArticles = mockArticles
    .filter((article) => article.id !== featuredArticle.id)
    .slice(0, 3);

  return (
    <section className="hero-news">
      <Link
        to={`/noticia/${featuredArticle.slug}`}
        className="hero-news__main"
      >
        <img
          className="hero-news__image"
          src={featuredArticle.image}
          alt=""
        />

        <div className="hero-news__overlay" />

        <div className="hero-news__content">
          <span className="hero-news__category">
            {featuredArticle.category}
          </span>

          <h1 className="hero-news__title">
            {featuredArticle.title}
          </h1>

          <p className="hero-news__excerpt">
            {featuredArticle.excerpt}
          </p>

          <div className="hero-news__metadata">
            <span>{featuredArticle.author.name}</span>
            <span>·</span>
            <span>
              {featuredArticle.readingTime} min de lectura
            </span>
          </div>
        </div>
      </Link>

      <div className="hero-news__secondary">
        {secondaryArticles.map((article) => (
          <Link
            key={article.id}
            to={`/noticia/${article.slug}`}
            className="hero-news__secondary-item"
          >
            <img
              className="hero-news__secondary-image"
              src={article.image}
              alt=""
            />

            <div className="hero-news__secondary-content">
              <span className="hero-news__secondary-category">
                {article.category}
              </span>

              <h2 className="hero-news__secondary-title">
                {article.title}
              </h2>

              <span className="hero-news__secondary-meta">
                {article.readingTime} min de lectura
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}