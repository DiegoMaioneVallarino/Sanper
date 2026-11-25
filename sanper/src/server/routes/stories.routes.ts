import { Router } from "express";

import { pool } from "../db/pool";
import { getStory, listStories } from "../repositories/stories.repo";
import { asyncHandler } from "./middleware";

export const storiesRouter = Router();

storiesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const stories = await listStories(pool);
    res.json({ stories });
  }),
);

storiesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const story = await getStory(pool, String(req.params.id));

    if (!story) {
      res.status(404).json({ error: "Historia no encontrada." });
      return;
    }

    res.json({ story });
  }),
);
