export interface SavedArticle {
  articleId: string;
  savedAt: string;
  collectionId?: string;
}

export interface SavedCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}