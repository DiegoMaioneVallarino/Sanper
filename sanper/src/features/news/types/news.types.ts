export interface ArticleAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export type ArticleCategory =
  | "Geopolítica"
  | "Economía"
  | "Mercados"
  | "Tecnología"
  | "Energía"
  | "Global"
  | "Análisis";

export interface Article {
  id: string;
  slug: string;

  storyId?: string;

  title: string;
  excerpt: string;

  // temporalmente conservamos category

  category: ArticleCategory;

  image: string;

  author: ArticleAuthor;

  publishedAt: string;
  readingTime: number;

  featured?: boolean;
}