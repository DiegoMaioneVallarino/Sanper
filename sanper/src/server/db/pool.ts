import pg, { type Pool, type PoolClient } from "pg";

import { config } from "../config";

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
});

pool.on("error", (error) => {
  console.error("[db] error inesperado en el pool", error);
});

export type Queryable = Pick<Pool, "query"> | PoolClient;

/*
 * Ejecuta `work` dentro de una transacción.
 * Hace ROLLBACK si algo lanza un error.
 */
export async function withTransaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
