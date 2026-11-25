import { Router } from "express";

import { pool } from "../db/pool";
import { listRuns } from "../repositories/ingestionRuns.repo";
import { runIngestion } from "../services/ingestion.service";
import { asyncHandler, requireEditor } from "./middleware";

export const ingestionRouter = Router();

/* POST /api/ingestion/run · lanza una corrida manual */
ingestionRouter.post(
  "/run",
  requireEditor,
  asyncHandler(async (_req, res) => {
    const summary = await runIngestion("manual");

    if (!summary) {
      res.status(409).json({ error: "Ya hay una ingesta en curso." });
      return;
    }

    res.json(summary);
  }),
);

/* GET /api/ingestion/runs · historial reciente */
ingestionRouter.get(
  "/runs",
  asyncHandler(async (_req, res) => {
    res.json({ runs: await listRuns(pool, 20) });
  }),
);
