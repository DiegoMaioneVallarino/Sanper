export interface RSSSource {
  id: string;
  name: string;
  url: string;
  language: string;
  enabled: boolean;
}

export const rssSources: RSSSource[] = [
  {
    id: "bbc-world",
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    language: "en",
    enabled: true,
  },
];