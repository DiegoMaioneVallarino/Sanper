import Parser from "rss-parser";

import {
  rssSources,
} from "../sources/rssSources";

const parser = new Parser();

export interface IngestedArticle {
  id: string;
  sourceId: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  receivedAt: string;
  language: string;
}

export async function fetchRSSArticles(): Promise<
  IngestedArticle[]
> {
  const articles: IngestedArticle[] = [];

  for (const source of rssSources) {
    if (!source.enabled) continue;

    try {
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items) {
        if (!item.title || !item.link) continue;

        articles.push({
          id: `${source.id}:${item.guid ?? item.link}`,
          sourceId: source.id,
          title: item.title,
          description: item.contentSnippet ?? "",
          url: item.link,
          publishedAt:
            item.isoDate ??
            item.pubDate ??
            new Date().toISOString(),
          receivedAt: new Date().toISOString(),
          language: source.language,
        });
      }
    } catch (error) {
      console.error(
        `Error fetching RSS source: ${source.id}`,
        error,
      );
    }
  }

  return articles;
}