import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";

import { config } from "./config";
import { pool } from "./db/pool";
import { migrate } from "./db/migrate";
import { ingestionRouter } from "./routes/ingestion.routes";
import { reviewRouter } from "./routes/review.routes";
import { storiesRouter } from "./routes/stories.routes";
import { runIngestion } from "./services/ingestion.service";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "sanper-api", db: "ok" });
  } catch {
    res.status(503).json({ status: "degraded", db: "unreachable" });
  }
});

app.use("/api/stories", storiesRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ingestion", ingestionRouter);

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.error("[api]", error);
    res.status(500).json({ error: "Error interno." });
  },
);

function scheduleIngestion(): void {
  if (config.ingestIntervalMinutes <= 0) {
    console.log("[ingesta] programación desactivada");
    return;
  }

  const run = () => {
    runIngestion("schedule").catch((error) =>
      console.error("[ingesta] corrida fallida", error),
    );
  };

  setInterval(run, config.ingestIntervalMinutes * 60_000);

  /* Primera corrida poco después de arrancar. */
  setTimeout(run, 5_000);

  console.log(
    `[ingesta] cada ${config.ingestIntervalMinutes} min`,
  );
}

async function start(): Promise<void> {
  await migrate();

  if (!config.editorToken) {
    console.warn(
      "[api] EDITOR_TOKEN vacío: las acciones editoriales no piden token (sólo para desarrollo).",
    );
  }

  app.listen(config.port, () => {
    console.log(`Sanper API: http://localhost:${config.port}`);
  });

  scheduleIngestion();
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
