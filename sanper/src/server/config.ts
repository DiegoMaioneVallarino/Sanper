/*
 * Configuración del servidor desde variables de entorno.
 * Node 22 las carga con `--env-file=.env` (ver package.json).
 */

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example a .env.`,
    );
  }

  return value;
}

function integer(name: string, fallback: number): number {
  const raw = process.env[name];

  if (!raw) return fallback;

  const value = Number.parseInt(raw, 10);

  if (Number.isNaN(value)) {
    throw new Error(`${name} debe ser un número entero.`);
  }

  return value;
}

export const config = {
  port: integer("PORT", 3001),
  databaseUrl: required("DATABASE_URL"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",

  /* 0 desactiva la ingesta programada. */
  ingestIntervalMinutes: integer("INGEST_INTERVAL_MINUTES", 60),

  /* Token simple para acciones de edición mientras no hay login. */
  editorToken: process.env.EDITOR_TOKEN ?? "",
};
