import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  ProcessingStatus,
  ReviewDecision,
  ReviewItem,
  ReviewStats,
} from "../../../shared/domain";

import { useSanperStoriesState } from "../../stories/hooks/useSanperStories";

import {
  fetchReviewItems,
  fetchReviewStats,
  submitDecision,
  triggerIngestion,
} from "../api/intelligence.api";

import "./IntelligenceReview.css";

function getStatusLabel(status: ProcessingStatus) {
  switch (status) {
    case "matched":
      return "Coincidencia alta";
    case "review_required":
      return "Requiere revisión";
    case "new_story":
      return "Nueva historia sugerida";
  }
}

function getDecisionLabel(decision: ReviewDecision) {
  switch (decision) {
    case "pending":
      return "Pendiente";
    case "approved":
      return "Aprobada";
    case "rejected":
      return "Rechazada";
  }
}

const EMPTY_STATS: ReviewStats = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
};

export function IntelligenceReview() {
  const {
    stories,
    source: storiesSource,
    reload: reloadStories,
  } = useSanperStoriesState();

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>(EMPTY_STATS);

  const [filter, setFilter] = useState<"all" | ReviewDecision>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [list, totals] = await Promise.all([
        fetchReviewItems(filter),
        fetchReviewStats(),
      ]);

      setItems(list.items);
      setStats(totals);
    } catch (cause) {
      setItems([]);
      setStats(EMPTY_STATS);
      setError(
        cause instanceof Error
          ? `No se pudo conectar con la API: ${cause.message}`
          : "No se pudo conectar con la API.",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = items.find((item) => item.articleId === selectedId);

  const storiesById = useMemo(
    () => new Map(stories.map((story) => [story.id, story])),
    [stories],
  );

  const suggestedStory = selected?.matchStoryId
    ? storiesById.get(selected.matchStoryId)
    : undefined;

  async function handleIngest() {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const summary = await triggerIngestion();

      setMessage(
        `Ingesta ${summary.runId}: ${summary.fetched} leídas, ` +
          `${summary.inserted} nuevas, ${summary.duplicates} duplicadas` +
          (summary.failedSources.length
            ? `, ${summary.failedSources.length} fuentes con error`
            : ""),
      );

      setFilter("pending");
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "La ingesta falló.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDecision(decision: ReviewDecision) {
    if (!selected) return;

    if (decision === "approved" && !suggestedStory) return;

    setBusy(true);
    setError(null);

    try {
      await submitDecision(
        selected.articleId,
        decision,
        decision === "approved" ? suggestedStory?.id : undefined,
      );

      await Promise.all([load(), reloadStories()]);

      if (decision === "pending") {
        setFilter("pending");
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "No se guardó la decisión.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="intelligence-review">
      {/* HEADER */}

      <header className="intelligence-review__header">
        <div>
          <span className="intelligence-review__eyebrow">
            SANPER / INTELLIGENCE ENGINE
          </span>

          <h2>Procesamiento de información</h2>

          <p>
            Clasificación automática, extracción de entidades y revisión
            editorial de notas reales ingeridas por el servidor.
          </p>
        </div>

        <button
          type="button"
          className="intelligence-review__process"
          onClick={handleIngest}
          disabled={busy}
        >
          {busy ? "Procesando…" : "Ejecutar ingesta ahora"}
        </button>
      </header>

      {message && <p className="intelligence-review__empty">{message}</p>}

      {error && <p className="intelligence-review__empty">{error}</p>}

      {storiesSource === "mock" && (
        <p className="intelligence-review__empty">
          Historias simuladas: la API de historias no respondió.
        </p>
      )}

      {/* MÉTRICAS */}

      <div className="intelligence-review__metrics">
        <div>
          <strong>{stats.total}</strong>
          <span>Procesadas</span>
        </div>

        <div>
          <strong>{stats.pending}</strong>
          <span>Pendientes</span>
        </div>

        <div>
          <strong>{stats.approved}</strong>
          <span>Aprobadas</span>
        </div>

        <div>
          <strong>{stats.rejected}</strong>
          <span>Rechazadas</span>
        </div>
      </div>

      {/* STORIES VINCULADAS */}

      <section className="intelligence-review__section">
        <h4>Acontecimientos y fuentes vinculadas</h4>

        <div className="intelligence-review__stories">
          {stories.map((story) => (
            <div key={story.id} className="intelligence-review__story">
              <div>
                <strong>{story.title}</strong>
                <span>{story.sectors.join(" · ")}</span>
              </div>

              <div className="intelligence-review__story-stats">
                <span>{story.articleIds.length} artículos</span>
                <span>{story.sourceIds.length} fuentes</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTROS */}

      <div className="intelligence-review__filters">
        {(
          [
            ["pending", "Pendientes"],
            ["approved", "Aprobadas"],
            ["rejected", "Rechazadas"],
            ["all", "Todas"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={filter === value ? "is-active" : ""}
            onClick={() => {
              setFilter(value);
              setSelectedId(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* WORKSPACE */}

      <div className="intelligence-review__workspace">
        {/* LISTA */}

        <div className="intelligence-review__list">
          {loading && (
            <p className="intelligence-review__empty">Cargando…</p>
          )}

          {!loading && items.length === 0 && (
            <p className="intelligence-review__empty">
              No hay noticias en esta sección.
            </p>
          )}

          {items.map((item) => (
            <button
              type="button"
              key={item.articleId}
              className={
                selectedId === item.articleId
                  ? "intelligence-review__item is-selected"
                  : "intelligence-review__item"
              }
              onClick={() => setSelectedId(item.articleId)}
            >
              <small>
                {item.sourceName} · {item.language.toUpperCase()}
              </small>

              <strong>{item.title}</strong>

              <span>
                {getStatusLabel(item.status)}
                {" · "}
                {(item.matchConfidence * 100).toFixed(1)}%
              </span>

              <small>Revisión: {getDecisionLabel(item.decision)}</small>
            </button>
          ))}
        </div>

        {/* DETALLE */}

        <div className="intelligence-review__detail">
          {!selected ? (
            <div className="intelligence-review__empty">
              Selecciona una noticia para inspeccionar el resultado del
              motor.
            </div>
          ) : (
            <>
              <span className="intelligence-review__eyebrow">
                ANÁLISIS DE NOTICIA
              </span>

              <h3>{selected.title}</h3>

              <p>{selected.description}</p>

              <p>
                <a href={selected.url} target="_blank" rel="noreferrer">
                  Ver nota original en {selected.sourceName}
                </a>
              </p>

              {/* SECTORES */}

              <div className="intelligence-review__section">
                <h4>Sectores detectados</h4>

                <div className="intelligence-review__tags">
                  {selected.sectors.length === 0 && (
                    <span>Sin sector</span>
                  )}

                  {selected.sectors.map((sector) => (
                    <span key={sector}>{sector}</span>
                  ))}
                </div>
              </div>

              {/* ENTIDADES */}

              <div className="intelligence-review__section">
                <h4>Entidades detectadas</h4>

                <div className="intelligence-review__entities">
                  {selected.entities.length === 0 && (
                    <span>No se detectaron entidades.</span>
                  )}

                  {selected.entities.map((entity) => (
                    <div key={`${entity.type}-${entity.name}`}>
                      <strong>{entity.name}</strong>
                      <small>{entity.type}</small>
                    </div>
                  ))}
                </div>
              </div>

              {/* COINCIDENCIA */}

              <div className="intelligence-review__section">
                <h4>Coincidencia sugerida</h4>

                {suggestedStory ? (
                  <div className="intelligence-review__match">
                    <span>STORY EXISTENTE</span>
                    <strong>{suggestedStory.title}</strong>
                    <p>{selected.matchReason}</p>
                    <small>
                      Similitud:{" "}
                      {(selected.matchConfidence * 100).toFixed(1)}%
                    </small>
                  </div>
                ) : (
                  <div className="intelligence-review__match">
                    <strong>Sin Story candidata</strong>
                    <p>{selected.matchReason}</p>
                  </div>
                )}
              </div>

              {/* ACCIONES */}

              {selected.decision === "pending" ? (
                <div className="intelligence-review__actions">
                  <button
                    type="button"
                    className="intelligence-review__approve"
                    disabled={!suggestedStory || busy}
                    onClick={() => handleDecision("approved")}
                  >
                    Aprobar vinculación
                  </button>

                  <button
                    type="button"
                    className="intelligence-review__reject"
                    disabled={busy}
                    onClick={() => handleDecision("rejected")}
                  >
                    Rechazar
                  </button>
                </div>
              ) : (
                <div className="intelligence-review__decision">
                  <span>
                    Decisión: {getDecisionLabel(selected.decision)}
                  </span>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDecision("pending")}
                  >
                    Reabrir revisión
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
