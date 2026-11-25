import type { Sector } from "./sectors";

/*
 * Artículo editorial publicado por Sanper
 * (no confundir con RawArticle, que es una nota
 * de una fuente externa).
 */

export interface ArticleAuthor {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

/*
 * Etiqueta visible en las cards. Se conserva
 * mientras la UI migra a `sectors`.
 */
export type ArticleCategory =
  | "Geopolítica"
  | "Economía"
  | "Mercados"
  | "Tecnología"
  | "Energía"
  | "Global"
  | "Análisis";

export type ArticleType =
  | "news"
  | "analysis"
  | "explainer";

export interface ArticleSection {
  id: string;
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  slug: string;

  /* Acontecimiento real al que pertenece. */
  storyId?: string;

  type: ArticleType;

  title: string;
  subtitle?: string;
  excerpt: string;

  category: ArticleCategory;
  sectors?: Sector[];

  image: string;
  imageCaption?: string;

  author: ArticleAuthor;

  publishedAt: string;
  updatedAt?: string;

  readingTime: number;

  sections: ArticleSection[];

  featured?: boolean;
}
