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
  | "Global";

export interface Article {
  id: string;
  slug: string;

  title: string;
  excerpt: string;

  category: ArticleCategory;

  image: string;

  author: ArticleAuthor;

  publishedAt: string;
  readingTime: number;

  featured?: boolean;
}