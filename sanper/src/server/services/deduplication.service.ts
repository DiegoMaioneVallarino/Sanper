import { createHash } from "node:crypto";

import { normalizeText } from "../../shared/engine";

/*
 * Tres niveles de duplicado:
 *  1. Misma URL canónica      → no se guarda (UNIQUE en la base).
 *  2. Mismo hash de contenido → se guarda con duplicate_of.
 *  3. Título casi igual       → se guarda con duplicate_of.
 *
 * Los niveles 2 y 3 se guardan para conservar la fuente
 * (otra fuente que confirma la misma noticia es una señal),
 * pero no entran a la cola de revisión.
 */

const TRACKING_PARAMS = /^(utm_|fbclid$|gclid$|mc_|ref$|cmpid$|ocid$)/i;

export function canonicalizeUrl(raw: string): string {
  try {
    const url = new URL(raw.trim());

    url.hash = "";
    url.hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, "");

    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMS.test(key)) {
        url.searchParams.delete(key);
      }
    }

    url.searchParams.sort();

    const pathname = url.pathname.replace(/\/+$/, "");
    const search = url.searchParams.toString();

    return `${url.protocol}//${url.hostname}${pathname}${
      search ? `?${search}` : ""
    }`;
  } catch {
    return raw.trim();
  }
}

export function contentHash(
  title: string,
  description: string,
): string {
  return createHash("sha256")
    .update(normalizeText(`${title} ${description}`))
    .digest("hex");
}

/* Id estable y corto: fuente + hash del guid o la URL. */
export function articleId(
  sourceId: string,
  guidOrUrl: string,
): string {
  const digest = createHash("sha1")
    .update(guidOrUrl)
    .digest("hex")
    .slice(0, 16);

  return `${sourceId}:${digest}`;
}

function titleTokens(title: string): Set<string> {
  return new Set(
    normalizeText(title)
      .split(" ")
      .filter((word) => word.length >= 4),
  );
}

export const NEAR_DUPLICATE_THRESHOLD = 0.8;

/* Similitud de Jaccard entre títulos. */
export function titleSimilarity(a: string, b: string): number {
  const tokensA = titleTokens(a);
  const tokensB = titleTokens(b);

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let shared = 0;

  for (const token of tokensA) {
    if (tokensB.has(token)) shared++;
  }

  return shared / (tokensA.size + tokensB.size - shared);
}

export interface DuplicateCandidate {
  id: string;
  title: string;
  contentHash: string;
}

/*
 * Busca el original del que esta nota es copia.
 * Devuelve su id, o null si es original.
 */
export function findDuplicateOf(
  title: string,
  hash: string,
  recent: DuplicateCandidate[],
): string | null {
  const sameHash = recent.find(
    (candidate) => candidate.contentHash === hash,
  );

  if (sameHash) return sameHash.id;

  let best: { id: string; score: number } | null = null;

  for (const candidate of recent) {
    const score = titleSimilarity(title, candidate.title);

    if (
      score >= NEAR_DUPLICATE_THRESHOLD &&
      (!best || score > best.score)
    ) {
      best = { id: candidate.id, score };
    }
  }

  return best?.id ?? null;
}
