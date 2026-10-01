import type { Article } from "../types/news.types";

export const mockArticles: Article[] = [
  {
    id: "article-hormuz-001",

    slug:
      "mercados-energeticos-presion-estrecho-ormuz",

    storyId:
      "hormuz-energy-pressure",

    type: "analysis",

    title:
      "Mercados energéticos bajo presión en el Estrecho de Ormuz",

    subtitle:
      "Las tensiones en uno de los corredores energéticos más importantes del mundo vuelven a introducir incertidumbre en los mercados internacionales.",

    excerpt:
      "El aumento de la tensión alrededor del Estrecho de Ormuz vuelve a poner bajo atención el flujo energético internacional.",

    category: "Energía",

    image: "/images/hormuz.jfif",

    imageCaption:
      "El Estrecho de Ormuz concentra una parte estratégica del tránsito energético internacional.",

    author: {
      id: "sanper-editorial",
      name: "SanPer",
      role: "Redacción",
    },

    publishedAt:
      "2026-09-30T18:00:00Z",

    updatedAt:
      "2026-09-30T20:30:00Z",

    readingTime: 7,

    sections: [
      {
        id: "context",

        paragraphs: [
          "El Estrecho de Ormuz vuelve a situarse en el centro de la atención internacional ante un nuevo periodo de tensión regional.",

          "La importancia del corredor convierte cualquier alteración de su actividad en un factor relevante para los mercados energéticos y para las economías dependientes del comercio internacional.",
        ],
      },

      {
        id: "markets",

        heading:
          "La reacción de los mercados",

        paragraphs: [
          "Los participantes del mercado siguen de cerca cualquier señal que pueda modificar las expectativas sobre el suministro energético.",

          "El impacto no se limita al precio de la energía. El transporte, los costes logísticos y las expectativas de inflación pueden reaccionar ante cambios significativos en la percepción de riesgo.",
        ],
      },

      {
        id: "geopolitics",

        heading:
          "Una cuestión energética y geopolítica",

        paragraphs: [
          "La relevancia del estrecho explica por qué los acontecimientos de la región trascienden rápidamente las fronteras de los países directamente involucrados.",

          "Para los mercados internacionales, la evolución de la situación dependerá tanto de los acontecimientos sobre el terreno como de las decisiones diplomáticas adoptadas durante los próximos días.",
        ],
      },
    ],

    featured: true,
  },

  {
    id: "article-2",

    slug:
      "nuevo-mapa-comercio-global",

    type: "analysis",

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

    publishedAt:
      "2026-09-29T12:00:00",

    readingTime: 6,

    sections: [
      {
        id: "main",

        paragraphs: [
          "Las transformaciones del comercio internacional están modificando las rutas utilizadas por empresas y economías para mover bienes alrededor del mundo.",

          "Los cambios responden a una combinación de tensiones internacionales, nuevas estrategias industriales y una creciente preocupación por la seguridad de las cadenas de suministro.",
        ],
      },
    ],
  },

  {
    id: "article-3",

    slug:
      "ia-poder-economico",

    type: "analysis",

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

    publishedAt:
      "2026-09-29T10:00:00",

    readingTime: 7,

    sections: [
      {
        id: "main",

        paragraphs: [
          "La expansión de la inteligencia artificial está convirtiendo la infraestructura tecnológica en un elemento cada vez más relevante para empresas y gobiernos.",

          "Centros de datos, semiconductores, energía y capacidad de cómputo forman parte de una nueva competencia económica alrededor de esta tecnología.",
        ],
      },
    ],
  },

  {
    id: "article-4",

    slug:
      "petroleo-transicion-energetica",

    type: "analysis",

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

    publishedAt:
      "2026-09-29T08:00:00",

    readingTime: 5,

    sections: [
      {
        id: "main",

        paragraphs: [
          "La transición energética está ocurriendo al mismo tiempo que los gobiernos reconsideran la seguridad y resiliencia de sus sistemas energéticos.",

          "El resultado es un escenario en el que las fuentes tradicionales y las nuevas tecnologías energéticas continuarán coexistiendo durante los próximos años.",
        ],
      },
    ],
  },

  {
    id: "article-5",

    slug:
      "infraestructura-inteligencia-artificial",

    type: "analysis",

    title:
      "La nueva carrera por la infraestructura de inteligencia artificial",

    excerpt:
      "Gobiernos, empresas tecnológicas y fondos de inversión están compitiendo por controlar la infraestructura que sostendrá la próxima generación de inteligencia artificial.",

    category: "Tecnología",

    image:
      "/images/datacenter.jfif",

    author: {
      id: "sofia-mendoza",
      name: "Sofía Mendoza",
    },

    publishedAt:
      "2026-09-28T18:00:00",

    readingTime: 12,

    sections: [
      {
        id: "main",

        paragraphs: [
          "La competencia alrededor de la inteligencia artificial ya no se limita al desarrollo de modelos. La infraestructura necesaria para entrenarlos y operarlos se está convirtiendo en un activo estratégico.",

          "La disponibilidad de centros de datos, energía, chips y capital determinará qué empresas y regiones pueden desplegar sistemas de inteligencia artificial a gran escala.",
        ],
      },
    ],
  },

  {
    id: "article-6",

    slug:
      "fragmentacion-comercio-mundial",

    type: "analysis",

    title:
      "La fragmentación del comercio mundial ya está cambiando las cadenas de suministro",

    excerpt:
      "Empresas y gobiernos reconsideran dónde producir, transportar y almacenar bienes estratégicos.",

    category: "Economía",

    image: "/images/cargo.jfif",

    author: {
      id: "martin-rojas",
      name: "Martín Rojas",
    },

    publishedAt:
      "2026-09-28T15:30:00",

    readingTime: 9,

    sections: [
      {
        id: "main",

        paragraphs: [
          "Las empresas están reconsiderando la estructura de sus cadenas de suministro ante un entorno internacional más fragmentado.",

          "La proximidad a los mercados, la estabilidad política y el acceso a infraestructura estratégica comienzan a pesar más en las decisiones sobre dónde producir y almacenar bienes.",
        ],
      },
    ],
  },

  {
    id: "article-7",

    slug:
      "energia-proxima-decada",

    type: "analysis",

    title:
      "La próxima década energética no tendrá un único ganador",

    excerpt:
      "Renovables, gas, nuclear y almacenamiento competirán dentro de sistemas energéticos cada vez más complejos.",

    category: "Energía",

    image: "/images/energy.jfif",

    author: {
      id: "lucas-herrera",
      name: "Lucas Herrera",
    },

    publishedAt:
      "2026-09-28T11:00:00",

    readingTime: 10,

    sections: [
      {
        id: "main",

        paragraphs: [
          "Los sistemas energéticos de la próxima década probablemente estarán formados por una combinación cada vez más diversa de tecnologías.",

          "Las renovables, el almacenamiento, el gas y la energía nuclear tendrán funciones diferentes dependiendo de las necesidades y recursos de cada economía.",
        ],
      },
    ],
  },

  {
    id: "article-8",

    slug:
      "nuevo-poder-capital",

    type: "analysis",

    title:
      "Dónde se está concentrando el nuevo poder del capital global",

    excerpt:
      "La inversión en tecnología, energía e infraestructura está modificando los centros tradicionales de poder económico.",

    category: "Mercados",

    image:
      "/images/markets.jfif",

    author: {
      id: "valentina-cruz",
      name: "Valentina Cruz",
    },

    publishedAt:
      "2026-09-27T20:00:00",

    readingTime: 11,

    sections: [
      {
        id: "main",

        paragraphs: [
          "Los grandes flujos de inversión están desplazándose hacia sectores considerados estratégicos para las próximas décadas.",

          "Tecnología, energía e infraestructura concentran una parte creciente de las decisiones de inversión que pueden modificar el equilibrio económico entre empresas y regiones.",
        ],
      },
    ],
  },
];