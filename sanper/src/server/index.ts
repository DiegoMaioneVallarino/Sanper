import express from "express";
import cors from "cors";

import {
  fetchRSSArticles,
} from "./services/rss.service";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "sanper-ingestion",
  });
});

app.get("/api/intelligence/articles", async (_req, res) => {
  try {
    const articles = await fetchRSSArticles();

    res.json({
      total: articles.length,
      articles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch RSS articles",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `SanPer Ingestion Server: http://localhost:${PORT}`,
  );
});