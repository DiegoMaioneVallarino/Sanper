import type {
  Comment,
} from "../types/comment.types";
export const mockComments: Comment[] = [
  {
    id: "comment-1",

    articleId: "article-hormuz-001",

    type: "opinion",

    author: {
      id: "user-1",
      name: "Alejandro R.",
    },

    content:
      "El efecto más importante podría no estar en el precio inmediato del petróleo, sino en cómo los mercados empiezan a valorar el riesgo de interrupción prolongada.",

    createdAt:
      "2026-10-02T18:20:00Z",

    likes: 18,
  },

  {
    id: "comment-2",

    articleId: "article-hormuz-001",

    type: "comment",

    author: {
      id: "user-2",
      name: "Mariana L.",
    },

    content:
      "Me gustaría ver una comparación con episodios anteriores de tensión en el estrecho.",

    createdAt:
      "2026-10-02T19:04:00Z",

    likes: 7,
  },

  {
    id: "comment-3",

    articleId: "article-hormuz-001",

    parentId: "comment-2",

    type: "comment",

    author: {
      id: "user-3",
      name: "Daniel M.",
    },

    content:
      "Estaría bien que esa comparación también apareciera en la línea temporal.",

    createdAt:
      "2026-10-02T19:18:00Z",

    likes: 3,
  },
];