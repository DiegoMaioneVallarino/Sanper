
import { useState } from "react";

import {
  mockStories,
} from "../../stories/data/mockStories";

import {
  intelligenceFixtures,
} from "../data/intelligence.fixtures";

import {
  processArticle,
} from "../engine/processArticle";

import {
  selectStoriesWithIntelligence,
} from "../selectors/selectStories";

import {
  useIntelligenceStore,
} from "../store/intelligence.store";

import type {
  ReviewDecision,
} from "../store/intelligence.store";

import type {
  ProcessingResult,
} from "../types/intelligence.types";

import "./IntelligenceReview.css";

function getStatusLabel(
  status: ProcessingResult["status"],
) {
  switch (status) {
    case "matched":
      return "Coincidencia alta";

    case "review_required":
      return "Requiere revisión";

    case "new_story":
      return "Nueva historia sugerida";
  }
}

function getDecisionLabel(
  decision: ReviewDecision,
) {
  switch (decision) {
    case "pending":
      return "Pendiente";

    case "approved":
      return "Aprobada";

    case "rejected":
      return "Rechazada";
  }
}

export function IntelligenceReview() {
  const records = useIntelligenceStore(
    (state) => state.records,
  );

  const importResults = useIntelligenceStore(
    (state) => state.importResults,
  );

  const approve = useIntelligenceStore(
    (state) => state.approve,
  );

  const reject = useIntelligenceStore(
    (state) => state.reject,
  );

  const reopen = useIntelligenceStore(
    (state) => state.reopen,
  );

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [filter, setFilter] = useState<
    "all" | ReviewDecision
  >("pending");

  const items = records;

  const selected = items.find(
    (item) => item.id === selectedId,
  );

  const filteredItems = items.filter(
    (item) =>
      filter === "all" ||
      item.decision === filter,
  );

  const pendingCount = items.filter(
    (item) => item.decision === "pending",
  ).length;

  const approvedCount = items.filter(
    (item) => item.decision === "approved",
  ).length;

  const rejectedCount = items.filter(
    (item) => item.decision === "rejected",
  ).length;

  const enrichedStories =
    selectStoriesWithIntelligence(
      mockStories,
      records,
    );

  const suggestedStory =
    selected?.result.match.storyId
      ? mockStories.find(
          (story) =>
            story.id ===
            selected.result.match.storyId,
        )
      : undefined;

  function handleProcess() {
    const results = intelligenceFixtures.map(
      (article) =>
        processArticle(article, {
          stories: mockStories,
        }),
    );

    importResults(results);

    setSelectedId(
      (current) =>
        current ??
        results[0]?.article.id ??
        null,
    );

    setFilter("pending");
  }

  function handleDecision(
    decision: "approved" | "rejected",
  ) {
    if (!selectedId) {
      return;
    }

    if (decision === "rejected") {
      reject(selectedId);
      return;
    }

    const record = records.find(
      (item) => item.id === selectedId,
    );

    const storyId =
      record?.result.match.storyId;

    if (!storyId) {
      return;
    }

    const storyExists = mockStories.some(
      (story) => story.id === storyId,
    );

    if (!storyExists) {
      return;
    }

    approve(selectedId, storyId);
  }

  function handleReopen() {
    if (!selectedId) {
      return;
    }

    reopen(selectedId);
    setFilter("pending");
  }

  return (
    <section className="intelligence-review">
      {/* HEADER */}

      <header className="intelligence-review__header">
        <div>
          <span className="intelligence-review__eyebrow">
            SANPER / INTELLIGENCE ENGINE
          </span>

          <h2>
            Procesamiento de información
          </h2>

          <p>
            Clasificación automática, extracción
            de entidades y revisión editorial
            de acontecimientos.
          </p>
        </div>

        <button
          type="button"
          className="intelligence-review__process"
          onClick={handleProcess}
        >
          Procesar noticias de prueba
        </button>
      </header>

      {/* MÉTRICAS */}

      <div className="intelligence-review__metrics">
        <div>
          <strong>{items.length}</strong>
          <span>Procesadas</span>
        </div>

        <div>
          <strong>{pendingCount}</strong>
          <span>Pendientes</span>
        </div>

        <div>
          <strong>{approvedCount}</strong>
          <span>Aprobadas</span>
        </div>

        <div>
          <strong>{rejectedCount}</strong>
          <span>Rechazadas</span>
        </div>
      </div>

      {/* STORIES VINCULADAS */}

      <section className="intelligence-review__section">
        <h4>
          Acontecimientos y fuentes vinculadas
        </h4>

        <div className="intelligence-review__stories">
          {enrichedStories.map((story) => (
            <div
              key={story.id}
              className="intelligence-review__story"
            >
              <div>
                <strong>{story.title}</strong>

                <span>
                  {story.sectors.join(" · ")}
                </span>
              </div>

              <div className="intelligence-review__story-stats">
                <span>
                  {story.articleIds.length}
                  {" "}artículos
                </span>

                <span>
                  {story.sourceIds.length}
                  {" "}fuentes
                </span>
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
            className={
              filter === value
                ? "is-active"
                : ""
            }
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
          {filteredItems.length === 0 && (
            <p className="intelligence-review__empty">
              No hay noticias en esta sección.
            </p>
          )}

          {filteredItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={
                selectedId === item.id
                  ? "intelligence-review__item is-selected"
                  : "intelligence-review__item"
              }
              onClick={() =>
                setSelectedId(item.id)
              }
            >
              <small>
                {item.result.article.sourceId}
              </small>

              <strong>
                {item.result.article.title}
              </strong>

              <span>
                {getStatusLabel(
                  item.result.status,
                )}

                {" · "}

                {(
                  item.result.match.confidence *
                  100
                ).toFixed(1)}
                %
              </span>

              <small>
                Revisión:{" "}
                {getDecisionLabel(
                  item.decision,
                )}
              </small>
            </button>
          ))}
        </div>

        {/* DETALLE */}

        <div className="intelligence-review__detail">
          {!selected ? (
            <div className="intelligence-review__empty">
              Selecciona una noticia para
              inspeccionar el resultado del motor.
            </div>
          ) : (
            <>
              <span className="intelligence-review__eyebrow">
                ANÁLISIS DE NOTICIA
              </span>

              <h3>
                {selected.result.article.title}
              </h3>

              <p>
                {selected.result.article.description}
              </p>

              {/* SECTORES */}

              <div className="intelligence-review__section">
                <h4>
                  Sectores detectados
                </h4>

                <div className="intelligence-review__tags">
                  {selected.result.classification.sectors.map(
                    (sector) => (
                      <span key={sector}>
                        {sector}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* ENTIDADES */}

              <div className="intelligence-review__section">
                <h4>
                  Entidades detectadas
                </h4>

                <div className="intelligence-review__entities">
                  {selected.result.classification.entities.length ===
                    0 && (
                    <span>
                      No se detectaron entidades.
                    </span>
                  )}

                  {selected.result.classification.entities.map(
                    (entity) => (
                      <div
                        key={`${entity.type}-${entity.name}`}
                      >
                        <strong>
                          {entity.name}
                        </strong>

                        <small>
                          {entity.type}
                        </small>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* COINCIDENCIA */}

              <div className="intelligence-review__section">
                <h4>
                  Coincidencia sugerida
                </h4>

                {suggestedStory ? (
                  <div className="intelligence-review__match">
                    <span>
                      STORY EXISTENTE
                    </span>

                    <strong>
                      {suggestedStory.title}
                    </strong>

                    <p>
                      {selected.result.match.reason}
                    </p>

                    <small>
                      Similitud:{" "}
                      {(
                        selected.result.match.confidence *
                        100
                      ).toFixed(1)}
                      %
                    </small>
                  </div>
                ) : (
                  <div className="intelligence-review__match">
                    <strong>
                      Sin Story candidata
                    </strong>

                    <p>
                      {selected.result.match.reason}
                    </p>
                  </div>
                )}
              </div>

              {/* ACCIONES */}

              {selected.decision === "pending" ? (
                <div className="intelligence-review__actions">
                  <button
                    type="button"
                    className="intelligence-review__approve"
                    disabled={!suggestedStory}
                    onClick={() =>
                      handleDecision("approved")
                    }
                  >
                    Aprobar vinculación
                  </button>

                  <button
                    type="button"
                    className="intelligence-review__reject"
                    onClick={() =>
                      handleDecision("rejected")
                    }
                  >
                    Rechazar
                  </button>
                </div>
              ) : (
                <div className="intelligence-review__decision">
                  <span>
                    Decisión:{" "}
                    {getDecisionLabel(
                      selected.decision,
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={handleReopen}
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
