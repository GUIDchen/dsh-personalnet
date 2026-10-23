export type SortMode = "featured" | "latest" | "title";

export interface ProjectLike {
  title: string;
  order: number;
  featured: boolean;
  domain: string;
  tags: string[];
  timeframe: { start: string; end?: string; ongoing: boolean };
}

export interface ProjectFilter {
  domain?: string;
  tags?: string[];
}
