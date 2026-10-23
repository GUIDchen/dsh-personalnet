import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedProjects } from "@/lib/content";
import { profile } from "@/data/profile";
import { absoluteUrl, toDate } from "@/lib/seo";

export async function GET(context: APIContext) {
  const projects = await getPublishedProjects();

  return rss({
    title: `${profile.name} · 项目`,
    description: profile.tagline,
    site: context.site ?? "https://example.com",
    items: projects.map((project) => ({
      title: project.data.title,
      description: project.data.summary,
      link: absoluteUrl(`projects/${project.id}/`),
      pubDate: toDate(project.data.timeframe.start),
      categories: [project.data.domain, ...project.data.tags],
    })),
    customData: "<language>zh-cn</language>",
  });
}
