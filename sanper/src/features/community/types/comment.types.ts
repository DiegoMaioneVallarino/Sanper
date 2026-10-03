export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export type CommentType =
  | "comment"
  | "opinion";

export interface Comment {
  id: string;

  articleId: string;

  parentId?: string;

  type: CommentType;

  author: CommentAuthor;

  content: string;

  createdAt: string;

  likes: number;
}