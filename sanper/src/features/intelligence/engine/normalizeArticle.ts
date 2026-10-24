import type {
  RawArticle,
  NormalizedArticle,
} from "../types/intelligence.types";

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeArticle(
  article: RawArticle,
): NormalizedArticle {
  const title = article.title.trim();
  const description = article.description.trim();
  const content = article.content?.trim() ?? "";

  const normalizedText = normalizeText(
    [
      title,
      description,
      content,
    ].join(" "),
  );

  return {
    ...article,
    title,
    description,
    content,
    normalizedText,
  };
}