import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedProjects } from "@/lib/content";
import { getPublishedNotes } from "@/lib/notes";
import { profile } from "@/data/profile";
import { absoluteUrl, toDate } from "@/lib/seo";

interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  categories: string[];
}

export async function GET(context: APIContext) {
  const [projects, notes] = await Promise.all([getPublishedProjects(), getPublishedNotes()]);

  const items: FeedItem[] = [
    ...projects.map((project) => ({
      title: project.data.title,
      description: project.data.summary,
      link: absoluteUrl(`projects/${project.id}/`),
      pubDate: toDate(project.data.timeframe.start),
      categories: [project.data.domain, ...project.data.tags],
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      link: absoluteUrl(`notes/${note.id}/`),
      pubDate: toDate(note.data.date.replace(/-/g, ".")),
      categories: note.data.tags,
    })),
  ]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);

  return rss({
    title: `${profile.name} · 项目与笔记`,
    description: profile.tagline,
    site: context.site ?? "https://example.com",
    items,
    customData: "<language>zh-cn</language>",
  });
}
