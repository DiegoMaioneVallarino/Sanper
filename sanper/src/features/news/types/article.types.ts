export type ArticleCategory =
  | "geopolitics"
  | "economy"
  | "markets"
  | "technology"
  | "energy"
  | "science"
  | "business";

export type ArticleType =
  | "news"
  | "analysis"
  | "explainer";

export interface ArticleAuthor {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface ArticleSection {
  id: string;
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  slug: string;

  /*
   * Conecta el artículo con el acontecimiento
   * real representado por Story.
   */
  storyId?: string;

  type: ArticleType;

  title: string;
  subtitle?: string;
  excerpt: string;

  /*
   * Lo mantenemos temporalmente porque
   * las cards actuales todavía pueden usarlo.
   */
  category: ArticleCategory;

  image: string;
  imageCaption?: string;

  author: ArticleAuthor;

  publishedAt: string;
  updatedAt?: string;

  readingTime: number;

  /*
   * Contenido completo del artículo.
   */
  sections: ArticleSection[];

  featured?: boolean;
}