import type { APIContext } from "astro";
import { getPublishedProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export async function GET(_context: APIContext) {
  const projects = await getPublishedProjects();
  const payload = {
    generatedAt: new Date().toISOString(),
    count: projects.length,
    projects: projects.map((project) => ({
      slug: project.id,
      title: project.data.title,
      titleEn: project.data.titleEn ?? null,
      summary: project.data.summary,
      summaryEn: project.data.summaryEn ?? null,
      domain: project.data.domain,
      tags: project.data.tags,
      year: project.data.timeframe.start.slice(0, 4),
      status: project.data.status,
      url: absoluteUrl(`projects/${project.id}/`),
      repo: project.data.links.repo ?? null,
      links: project.data.links,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
