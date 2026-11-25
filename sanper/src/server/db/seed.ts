/*
 * Datos iniciales: fuentes, historias de ejemplo y un usuario editor.
 * Se puede correr varias veces sin duplicar nada.
 *
 *   npm run db:seed
 */
import { fileURLToPath } from "node:url";

import { mockStories } from "../../features/stories/data/mockStories";
import { sourceSeeds } from "../sources/rssSources";
import { upsertSource } from "../repositories/sources.repo";
import { upsertStory } from "../repositories/stories.repo";
import { pool, withTransaction } from "./pool";

/* Las historias "demo-*" son ficticias: sólo para el frontend sin API. */
const seedStories = mockStories.filter(
  (story) => !story.id.startsWith("demo-"),
);

export async function seed(): Promise<void> {
  await withTransaction(async (client) => {
    for (const source of sourceSeeds) {
      await upsertSource(client, source);
    }

    /*
     * Las historias simuladas sirven de punto de partida
     * para que el motor tenga con qué emparejar. Sus
     * articleIds apuntan a artículos editoriales, no a
     * notas ingeridas, así que no se vinculan.
     */
    for (const story of seedStories) {
      await upsertStory(client, story);
    }

    await client.query(
      `INSERT INTO users (handle, display_name, role)
       VALUES ('editor', 'Editor Sanper', 'editor')
       ON CONFLICT (handle) DO NOTHING`,
    );
  });

  console.log(
    `[db] seed: ${sourceSeeds.length} fuentes, ${seedStories.length} historias, 1 editor`,
  );
}

const isCli =
  process.argv[1] === fileURLToPath(import.meta.url);

if (isCli) {
  seed()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
