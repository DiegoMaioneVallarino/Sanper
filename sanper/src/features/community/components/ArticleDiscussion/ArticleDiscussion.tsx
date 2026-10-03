import {
  useMemo,
  useState,
} from "react";

import {
  mockComments,
} from "../../data/mockComments";

import type {
  CommentType,
} from "../../types/comment.types";

import "./ArticleDiscussion.css";

interface ArticleDiscussionProps {
  articleId: string;
}

export function ArticleDiscussion({
  articleId,
}: ArticleDiscussionProps) {
  const [type, setType] =
    useState<CommentType>("comment");

  const [content, setContent] =
    useState("");

  const comments = useMemo(
    () =>
      mockComments.filter(
        (comment) =>
          comment.articleId === articleId &&
          !comment.parentId,
      ),
    [articleId],
  );

  return (
    <section className="article-discussion">
      <header className="article-discussion__header">
        <span className="article-discussion__eyebrow">
          COMUNIDAD
        </span>

        <h2>
          Comentarios y opinión
        </h2>

        <p>
          Participa en la conversación sobre
          esta historia.
        </p>
      </header>

      <div className="article-discussion__composer">
        <div className="article-discussion__types">
          <button
            type="button"
            className={
              type === "comment"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setType("comment")
            }
          >
            Comentario
          </button>

          <button
            type="button"
            className={
              type === "opinion"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setType("opinion")
            }
          >
            Opinión
          </button>
        </div>

        <textarea
          value={content}
          placeholder={
            type === "opinion"
              ? "Desarrolla tu opinión sobre esta historia..."
              : "Únete a la conversación..."
          }
          onChange={(event) =>
            setContent(
              event.target.value,
            )
          }
        />

        <div className="article-discussion__composer-footer">
          <span>
            {content.length} / 1200
          </span>

          <button
            type="button"
            disabled={
              content.trim().length === 0
            }
          >
            Publicar
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
  <div className="article-discussion__empty">
    <strong>
      Sé el primero en participar
    </strong>

    <span>
      Todavía no hay comentarios sobre esta noticia.
    </span>
  </div>
) : (
  <div className="article-discussion__list">
    {comments.map((comment) => (
      <article
        key={comment.id}
        className={
          comment.type === "opinion"
            ? "discussion-comment discussion-comment--opinion"
            : "discussion-comment"
        }
      >
        <div className="discussion-comment__avatar">
          {comment.author.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="discussion-comment__content">
          <div className="discussion-comment__meta">
            <strong>
              {comment.author.name}
            </strong>

            {comment.type === "opinion" && (
              <span className="discussion-comment__type">
                Opinión
              </span>
            )}

            <time>
              {new Date(
                comment.createdAt,
              ).toLocaleDateString(
                "es-MX",
              )}
            </time>
          </div>

          <p>
            {comment.content}
          </p>

          <div className="discussion-comment__actions">
            <button type="button">
              ↑ {comment.likes}
            </button>

            <button type="button">
              Responder
            </button>
          </div>
        </div>
      </article>
    ))}
  </div>
)}
    </section>
  );
}