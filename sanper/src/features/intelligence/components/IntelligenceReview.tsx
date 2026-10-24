
import { useState } from "react";
import { mockStories } from "../../stories/data/mockStories";
import { intelligenceFixtures } from "../data/intelligence.fixtures";
import { processArticle } from "../engine/processArticle";
import type {
  ProcessingResult,
} from "../types/intelligence.types";
import "./IntelligenceReview.css";

type ReviewDecision = "pending" | "approved" | "rejected";

type ReviewItem = {
  id: string;
  result: ProcessingResult;
  decision: ReviewDecision;
};

function createReviewItems(): ReviewItem[] {
  return intelligenceFixtures.map((article) => ({
    id: article.id,
    result: processArticle(article, {
      stories: mockStories,
    }),
    decision: "pending",
  }));
}

function getStatusLabel(status: ProcessingResult["status"]) {
  switch (status) {
    case "matched":
      return "Coincidencia alta";
    case "review_required":
      return "Requiere revisión";
    case "new_story":
      return "Nueva historia sugerida";
  }
}

export function IntelligenceReview() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | ReviewDecision
  >("pending");

  const selected = items.find(
    (item) => item.id === selectedId,
  );

  const filteredItems = items.filter(
    (item) => filter === "all" || item.decision === filter,
  );

  const pendingCount = items.filter(
    (item) => item.decision === "pending",
  ).length;

  function handleProcess() {
    const processed = createReviewItems();
    setItems(processed);
    setSelectedId(processed[0]?.id ?? null);
    setFilter("pending");
  }

  function handleDecision(decision: "approved" | "rejected") {
    if (!selectedId) return;

    setItems((current) =>
      current.map((item) =>
        item.id === selectedId
          ? { ...item, decision }
          : item,
      ),
    );
  }

  const suggestedStory = selected?.result.match.storyId
    ? mockStories.find(
        (story) =>
          story.id === selected.result.match.storyId,
      )
    : undefined;

  return (
    <section className="intelligence-review">
      <header className="intelligence-review__header">
        <div>
          <span className="intelligence-review__eyebrow">
            SANPER / INTELLIGENCE ENGINE
          </span>
          <h2>Procesamiento de información</h2>
          <p>
            Clasificación automática, extracción de entidades
            y revisión de acontecimientos.
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
          <strong>
            {items.filter((item) => item.decision === "approved").length}
          </strong>
          <span>Aprobadas</span>
        </div>
        <div>
          <strong>
            {items.filter((item) => item.decision === "rejected").length}
          </strong>
          <span>Rechazadas</span>
        </div>
      </div>

      <div className="intelligence-review__filters">
        {([
          ["pending", "Pendientes"],
          ["approved", "Aprobadas"],
          ["rejected", "Rechazadas"],
          ["all", "Todas"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={filter === value ? "is-active" : ""}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="intelligence-review__workspace">
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
              onClick={() => setSelectedId(item.id)}
            >
              <small>{item.result.article.sourceId}</small>
              <strong>{item.result.article.title}</strong>
              <span>
                {getStatusLabel(item.result.status)}
                {" · "}
                {(item.result.match.confidence * 100).toFixed(1)}%
              </span>
              <small>Revisión: {item.decision}</small>
            </button>
          ))}
        </div>

        <div className="intelligence-review__detail">
          {!selected ? (
            <div className="intelligence-review__empty">
              Selecciona una noticia para inspeccionar
              el resultado del motor.
            </div>
          ) : (
            <>
              <span className="intelligence-review__eyebrow">
                ANÁLISIS DE NOTICIA
              </span>

              <h3>{selected.result.article.title}</h3>
              <p>{selected.result.article.description}</p>

              <div className="intelligence-review__section">
                <h4>Sectores detectados</h4>
                <div className="intelligence-review__tags">
                  {selected.result.classification.sectors.map(
                    (sector) => (
                      <span key={sector}>{sector}</span>
                    ),
                  )}
                </div>
              </div>

              <div className="intelligence-review__section">
                <h4>Entidades detectadas</h4>
                <div className="intelligence-review__entities">
                  {selected.result.classification.entities.length === 0 && (
                    <span>No se detectaron entidades.</span>
                  )}

                  {selected.result.classification.entities.map(
                    (entity) => (
                      <div key={`${entity.type}-${entity.name}`}>
                        <strong>{entity.name}</strong>
                        <small>{entity.type}</small>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="intelligence-review__section">
                <h4>Coincidencia sugerida</h4>

                {suggestedStory ? (
                  <div className="intelligence-review__match">
                    <span>STORY EXISTENTE</span>
                    <strong>{suggestedStory.title}</strong>
                    <p>{selected.result.match.reason}</p>
                    <small>
                      Similitud:{" "}
                      {(selected.result.match.confidence * 100).toFixed(1)}%
                    </small>
                  </div>
                ) : (
                  <div className="intelligence-review__match">
                    <strong>Sin Story candidata</strong>
                    <p>
                      {selected.result.match.reason}
                    </p>
                  </div>
                )}
              </div>

              {selected.decision === "pending" ? (
                <div className="intelligence-review__actions">
                  <button
                    type="button"
                    className="intelligence-review__approve"
                    disabled={!suggestedStory}
                    onClick={() => handleDecision("approved")}
                  >
                    Aprobar vinculación
                  </button>
                  <button
                    type="button"
                    className="intelligence-review__reject"
                    onClick={() => handleDecision("rejected")}
                  >
                    Rechazar
                  </button>
                </div>
              ) : (
                <div className="intelligence-review__decision">
                  Decisión: {selected.decision}
                  <button
                    type="button"
                    onClick={() => {
                      setItems((current) =>
                        current.map((item) =>
                          item.id === selected.id
                            ? { ...item, decision: "pending" }
                            : item,
                        ),
                      );
                    }}
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
