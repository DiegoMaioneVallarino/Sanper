import type {
  RawArticle,
  NormalizedArticle,
} from "../domain";

/*
 * Minúsculas, sin acentos, sin puntuación,
 * espacios colapsados. Igual para español e inglés.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Busca una frase completa (no subcadenas):
 * "ue" no coincide dentro de "fue".
 */
export function containsPhrase(
  normalizedText: string,
  normalizedPhrase: string,
): boolean {
  return ` ${normalizedText} `.includes(
    ` ${normalizedPhrase} `,
  );
}

export function normalizeArticle(
  article: RawArticle,
): NormalizedArticle {
  const title = article.title.trim();
  const description = article.description.trim();
  const content = article.content?.trim() ?? "";

  return {
    id: article.id,
    sourceId: article.sourceId,
    url: article.url,
    title,
    description,
    content,
    publishedAt: article.publishedAt,
    language: article.language,
    normalizedText: normalizeText(
      [title, description, content].join(" "),
    ),
  };
}
