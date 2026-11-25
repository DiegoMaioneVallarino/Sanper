import { Router } from "express";

import type { ReviewDecision } from "../../shared/domain";

import { pool, withTransaction } from "../db/pool";

import {
  getReviewStats,
  listReviewItems,
  recordDecision,
} from "../repositories/reviews.repo";

import { storyExists } from "../repositories/stories.repo";
import { asyncHandler, requireEditor } from "./middleware";

export const reviewRouter = Router();

const DECISIONS: ReviewDecision[] = ["pending", "approved", "rejected"];

function isDecision(value: unknown): value is ReviewDecision {
  return (
    typeof value === "string" &&
    (DECISIONS as string[]).includes(value)
  );
}

/* GET /api/review/items?decision=pending&limit=100 */
reviewRouter.get(
  "/items",
  asyncHandler(async (req, res) => {
    const decision = req.query.decision;
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 100, 1),
      500,
    );

    if (decision !== undefined && decision !== "all" && !isDecision(decision)) {
      res.status(400).json({ error: "Decisión no válida." });
      return;
    }

    const items = await listReviewItems(pool, {
      decision: isDecision(decision) ? decision : undefined,
      limit,
    });

    res.json({ items });
  }),
);

reviewRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    res.json(await getReviewStats(pool));
  }),
);

/*
 * POST /api/review/items/:articleId/decision
 * body: { decision, storyId?, note? }
 */
reviewRouter.post(
  "/items/:articleId/decision",
  requireEditor,
  asyncHandler(async (req, res) => {
    const articleId = String(req.params.articleId);
    const { decision, storyId, note } = req.body ?? {};

    if (!isDecision(decision)) {
      res.status(400).json({ error: "Decisión no válida." });
      return;
    }

    if (decision === "approved") {
      if (typeof storyId !== "string" || !storyId) {
        res.status(400).json({ error: "Aprobar requiere storyId." });
        return;
      }

      if (!(await storyExists(pool, storyId))) {
        res.status(404).json({ error: "La historia no existe." });
        return;
      }
    }

    const found = await withTransaction((client) =>
      recordDecision(client, {
        articleId,
        decision,
        storyId: decision === "approved" ? storyId : null,
        reviewerId: null,
        note: typeof note === "string" ? note : null,
      }),
    );

    if (!found) {
      res.status(404).json({ error: "Artículo no encontrado en la cola." });
      return;
    }

    res.json({ ok: true });
  }),
);
