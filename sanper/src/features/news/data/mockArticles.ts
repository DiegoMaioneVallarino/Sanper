import type { Article } from "../types/news.types";

export const mockArticles: Article[] = [
  {
    id: "article-1",
    slug: "nuevo-equilibrio-global",

    title:
      "Un nuevo equilibrio global: las decisiones que marcarán la próxima década",

    excerpt:
      "La reconfiguración de alianzas, la competencia tecnológica y la transición energética están redefiniendo el orden mundial.",

    category: "Geopolítica",

    image: "/images/capitol.jfif",

    author: {
      id: "alejandro-torres",
      name: "Alejandro Torres",
    },

    publishedAt: "2026-09-29T14:00:00",
    readingTime: 8,

    featured: true,
  },

  {
    id: "article-2",
    slug: "nuevo-mapa-comercio-global",

    title:
      "El nuevo mapa del comercio global tras las tensiones internacionales",

    excerpt:
      "Las nuevas rutas comerciales están modificando las relaciones económicas entre regiones.",

    category: "Economía",

    image: "/images/port.jfif",

    author: {
      id: "diego-ramirez",
      name: "Diego Ramírez",
    },

    publishedAt: "2026-09-29T12:00:00",
    readingTime: 6,
  },

  {
    id: "article-3",
    slug: "ia-poder-economico",

    title:
      "Cómo la inteligencia artificial está reconfigurando el poder económico",

    excerpt:
      "La infraestructura de IA comienza a convertirse en un nuevo elemento estratégico global.",

    category: "Tecnología",

    image: "/images/chip.jfif",

    author: {
      id: "valentina-cruz",
      name: "Valentina Cruz",
    },

    publishedAt: "2026-09-29T10:00:00",
    readingTime: 7,
  },

  {
    id: "article-4",
    slug: "petroleo-transicion-energetica",

    title:
      "Petróleo, transición y seguridad energética: lo que viene",

    excerpt:
      "Los mercados energéticos afrontan una transformación marcada por nuevas tensiones geopolíticas.",

    category: "Energía",

    image: "/images/oil.jfif",

    author: {
      id: "lucas-herrera",
      name: "Lucas Herrera",
    },

    publishedAt: "2026-09-29T08:00:00",
    readingTime: 5,
  },
];