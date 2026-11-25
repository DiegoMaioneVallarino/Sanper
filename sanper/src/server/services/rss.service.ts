import Parser from "rss-parser";

import type { SourceRow } from "../repositories/sources.repo";

const parser = new Parser({
  timeout: 15_000,
  headers: {
    "User-Agent": "SanperBot/0.1 (+https://sanper.example)",
  },
});

export interface FeedItem {
  guid: string;
  url: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function toIsoDate(value: string | undefined): string {
  if (value) {
    const parsed = Date.parse(value);

    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  return new Date().toISOString();
}

/*
 * Descarga un feed. Lanza error si el feed falla;
 * quien llama decide cómo registrarlo.
 *
 * Nota: el RSS trae resumen, no siempre el texto completo.
 * La extracción del cuerpo de la nota es parte de la fase 1.
 */
export async function fetchFeed(
  source: SourceRow,
): Promise<FeedItem[]> {
  const feed = await parser.parseURL(source.url);

  const items: FeedItem[] = [];

  for (const item of feed.items) {
    if (!item.title || !item.link) continue;

    const encoded =
      (item as Record<string, unknown>)["content:encoded"];

    const rawContent =
      typeof encoded === "string"
        ? encoded
        : item.content ?? "";

    items.push({
      guid: item.guid ?? item.link,
      url: item.link,
      title: stripHtml(item.title),
      description: stripHtml(item.contentSnippet ?? item.summary ?? ""),
      content: stripHtml(rawContent),
      publishedAt: toIsoDate(item.isoDate ?? item.pubDate),
    });
  }

  return items;
}
