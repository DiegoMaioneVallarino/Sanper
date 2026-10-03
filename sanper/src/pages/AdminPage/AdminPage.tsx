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

import {
  mockComments,
} from "../../features/community/data/mockComments";

import "./AdminPage.css";


type AdminSection =
  | "overview"
  | "stories"
  | "articles"
  | "sources"
  | "community"
  | "users";


function formatDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(date));
}


export function AdminPage() {
  const [
    activeSection,
    setActiveSection,
  ] = useState<AdminSection>(
    "overview",
  );


  const highRelevanceStories =
    useMemo(
      () =>
        mockStories.filter(
          (story) =>
            story.relevance ===
            "high",
        ),
      [],
    );


  const opinions =
    useMemo(
      () =>
        mockComments.filter(
          (comment) =>
            comment.type ===
            "opinion",
        ),
      [],
    );


  const navigation: {
    id: AdminSection;
    label: string;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: "Resumen",
    },
    {
      id: "stories",
      label: "Historias",
      count: mockStories.length,
    },
    {
      id: "articles",
      label: "Artículos",
      count: mockArticles.length,
    },
    {
      id: "sources",
      label: "Fuentes",
    },
    {
      id: "community",
      label: "Comunidad",
      count: mockComments.length,
    },
    {
      id: "users",
      label: "Usuarios",
    },
  ];


  return (
    <main className="admin-page">

      {/* HEADER */}

      <header className="admin-header">

        <div>
          <span className="admin-header__eyebrow">
            SANPER / ADMIN
          </span>

          <h1>
            Administración
          </h1>

          <p>
            Centro editorial y operativo
            de SanPer.
          </p>
        </div>


        <div className="admin-header__user">
          <div>
            A
          </div>

          <span>
            Administrador
          </span>
        </div>

      </header>


      <div className="admin-layout">

        {/* SIDEBAR */}

        <aside className="admin-nav">

          <span className="admin-nav__label">
            PANEL
          </span>

          {navigation.map(
            (item) => (
              <button
                key={item.id}
                type="button"
                className={
                  activeSection ===
                  item.id
                    ? "admin-nav__item is-active"
                    : "admin-nav__item"
                }
                onClick={() =>
                  setActiveSection(
                    item.id,
                  )
                }
              >
                <span>
                  {item.label}
                </span>

                {item.count !==
                  undefined && (
                  <small>
                    {item.count}
                  </small>
                )}
              </button>
            ),
          )}


          <div className="admin-nav__separator" />


          <Link
            to="/"
            className="admin-nav__back"
          >
            ← Volver a SanPer
          </Link>

        </aside>


        {/* CONTENT */}

        <div className="admin-content">

          {activeSection ===
            "overview" && (
            <Overview
              highRelevanceStories={
                highRelevanceStories
              }
              opinions={opinions}
            />
          )}


          {activeSection ===
            "stories" && (
            <StoriesAdmin />
          )}


          {activeSection ===
            "articles" && (
            <ArticlesAdmin />
          )}


          {activeSection ===
            "sources" && (
            <PlaceholderSection
              eyebrow="FUENTES"
              title="Administración de fuentes"
              description="Gestiona el registro, verificación y reputación de las fuentes utilizadas por SanPer."
            />
          )}


          {activeSection ===
            "community" && (
            <CommunityAdmin />
          )}


          {activeSection ===
            "users" && (
            <PlaceholderSection
              eyebrow="USUARIOS"
              title="Administración de usuarios"
              description="Gestiona cuentas, permisos y actividad de los miembros de la plataforma."
            />
          )}

        </div>

      </div>

    </main>
  );
}


/* =========================================================
   OVERVIEW
   ========================================================= */


interface OverviewProps {
  highRelevanceStories:
    typeof mockStories;

  opinions:
    typeof mockComments;
}


function Overview({
  highRelevanceStories,
  opinions,
}: OverviewProps) {
  return (
    <section>

      <AdminSectionHeader
        eyebrow="RESUMEN"
        title="Estado de SanPer"
        description="Actividad editorial y operativa de la plataforma."
      />


      <div className="admin-metrics">

        <Metric
          value={
            mockStories.length
          }
          label="Historias activas"
          detail={
            `${highRelevanceStories.length} de alta relevancia`
          }
        />

        <Metric
          value={
            mockArticles.length
          }
          label="Artículos"
          detail="Contenido publicado"
        />

        <Metric
          value={
            mockComments.length
          }
          label="Interacciones"
          detail={
            `${opinions.length} opiniones`
          }
        />

        <Metric
          value="—"
          label="Fuentes"
          detail="Registro pendiente"
        />

      </div>


      <div className="admin-overview-grid">

        {/* STORIES */}

        <section className="admin-panel">

          <div className="admin-panel__header">
            <div>
              <span>
                INTELIGENCIA
              </span>

              <h3>
                Historias relevantes
              </h3>
            </div>
          </div>


          <div className="admin-story-list">

            {mockStories
              .slice(0, 5)
              .map((story) => (
                <div
                  key={story.id}
                  className="admin-story"
                >
                  <span
                    className={
                      `admin-story__status admin-story__status--${story.relevance}`
                    }
                  />

                  <div>
                    <strong>
                      {story.title}
                    </strong>

                    <span>
                      {story.sectors
                        .join(" · ")}
                    </span>
                  </div>

                  <small>
                    {story.relevance ===
                    "high"
                      ? "Alta"
                      : story.relevance ===
                          "medium"
                        ? "Media"
                        : "Seguimiento"}
                  </small>
                </div>
              ))}

          </div>

        </section>


        {/* ACTIVITY */}

        <section className="admin-panel">

          <div className="admin-panel__header">
            <div>
              <span>
                ACTIVIDAD
              </span>

              <h3>
                Comunidad reciente
              </h3>
            </div>
          </div>


          <div className="admin-activity">

            {mockComments
              .slice(0, 5)
              .map(
                (comment) => (
                  <div
                    key={
                      comment.id
                    }
                    className="admin-activity__item"
                  >
                    <div className="admin-activity__avatar">
                      {comment.author.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {
                          comment
                            .author
                            .name
                        }
                      </strong>

                      <p>
                        {comment.content}
                      </p>

                      <span>
                        {formatDate(
                          comment.createdAt,
                        )}
                      </span>
                    </div>
                  </div>
                ),
              )}

          </div>

        </section>

      </div>

    </section>
  );
}


/* =========================================================
   STORIES
   ========================================================= */


function StoriesAdmin() {
  return (
    <section>

      <AdminSectionHeader
        eyebrow="INTELIGENCIA"
        title="Historias"
        description="Administra los acontecimientos que conectan noticias, sectores, territorios y el mapa."
        action="Nueva historia"
      />


      <div className="admin-table">

        <div className="admin-table__head admin-table__stories">
          <span>Historia</span>
          <span>Sector</span>
          <span>Relevancia</span>
          <span />
        </div>


        {mockStories.map(
          (story) => (
            <div
              key={story.id}
              className="admin-table__row admin-table__stories"
            >

              <div className="admin-table__primary">
                <strong>
                  {story.title}
                </strong>

                <span>
                  {story.territories
                    .map(
                      (
                        territory,
                      ) =>
                        territory.code,
                    )
                    .join(" · ")}
                </span>
              </div>


              <span>
                {story.sectors[0]}
              </span>


              <div className="admin-relevance">
                <i
                  className={
                    `admin-story__status admin-story__status--${story.relevance}`
                  }
                />

                {story.relevance ===
                "high"
                  ? "Alta"
                  : story.relevance ===
                      "medium"
                    ? "Media"
                    : "Seguimiento"}
              </div>


              <button
                type="button"
                className="admin-more"
              >
                ···
              </button>

            </div>
          ),
        )}

      </div>

    </section>
  );
}


/* =========================================================
   ARTICLES
   ========================================================= */


function ArticlesAdmin() {
  return (
    <section>

      <AdminSectionHeader
        eyebrow="EDITORIAL"
        title="Artículos"
        description="Gestiona noticias, análisis y explicadores publicados en SanPer."
        action="Nuevo artículo"
      />


      <div className="admin-table">

        <div className="admin-table__head admin-table__articles">
          <span>Artículo</span>
          <span>Tipo</span>
          <span>Fecha</span>
          <span />
        </div>


        {mockArticles.map(
          (article) => (
            <div
              key={article.id}
              className="admin-table__row admin-table__articles"
            >

              <div className="admin-table__primary">
                <strong>
                  {article.title}
                </strong>

                <span>
                  {article.category}
                </span>
              </div>


              <span>
                {article.type ===
                "analysis"
                  ? "Análisis"
                  : article.type ===
                      "explainer"
                    ? "Explicador"
                    : "Noticia"}
              </span>


              <span>
                {formatDate(
                  article.publishedAt,
                )}
              </span>


              <Link
                to={`/noticia/${article.slug}`}
                className="admin-view"
              >
                Ver
              </Link>

            </div>
          ),
        )}

      </div>

    </section>
  );
}


/* =========================================================
   COMMUNITY
   ========================================================= */


function CommunityAdmin() {
  return (
    <section>

      <AdminSectionHeader
        eyebrow="COMUNIDAD"
        title="Moderación"
        description="Revisa comentarios y opiniones publicados por la comunidad."
      />


      <div className="admin-moderation">

        {mockComments.map(
          (comment) => (
            <article
              key={comment.id}
              className="admin-moderation__item"
            >

              <div className="admin-moderation__author">

                <div>
                  {comment.author.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <span>
                  <strong>
                    {
                      comment.author
                        .name
                    }
                  </strong>

                  <small>
                    {comment.type ===
                    "opinion"
                      ? "Opinión"
                      : "Comentario"}
                  </small>
                </span>

              </div>


              <p>
                {comment.content}
              </p>


              <div className="admin-moderation__actions">

                <span>
                  {formatDate(
                    comment.createdAt,
                  )}
                </span>

                <div>
                  <button
                    type="button"
                  >
                    Ocultar
                  </button>

                  <button
                    type="button"
                    className="is-danger"
                  >
                    Eliminar
                  </button>
                </div>

              </div>

            </article>
          ),
        )}

      </div>

    </section>
  );
}


/* =========================================================
   SHARED
   ========================================================= */


interface AdminSectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
}


function AdminSectionHeader({
  eyebrow,
  title,
  description,
  action,
}: AdminSectionHeaderProps) {
  return (
    <header className="admin-section-header">

      <div>
        <span>
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>
      </div>


      {action && (
        <button type="button">
          + {action}
        </button>
      )}

    </header>
  );
}


interface MetricProps {
  value:
    | string
    | number;

  label: string;
  detail: string;
}


function Metric({
  value,
  label,
  detail,
}: MetricProps) {
  return (
    <div className="admin-metric">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

      <small>
        {detail}
      </small>

    </div>
  );
}


interface PlaceholderSectionProps {
  eyebrow: string;
  title: string;
  description: string;
}


function PlaceholderSection({
  eyebrow,
  title,
  description,
}: PlaceholderSectionProps) {
  return (
    <section>

      <AdminSectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="admin-placeholder">
        <strong>
          Módulo preparado
        </strong>

        <span>
          Esta sección se conectará
          con los datos de SanPer.
        </span>
      </div>

    </section>
  );
}