import type { APIContext } from "astro";
import { getPublishedProjects } from "@/lib/content";
import { getPublishedNotes } from "@/lib/notes";
import { absoluteUrl, toDate } from "@/lib/seo";

export async function GET(_context: APIContext) {
  const projects = await getPublishedProjects();
  const notes = await getPublishedNotes();
  const projectItems = projects.map((project) => ({
    id: absoluteUrl(`projects/${project.id}/`),
    url: absoluteUrl(`projects/${project.id}/`),
    title: project.data.title,
    summary: project.data.summary,
    date_published: toDate(project.data.timeframe.start).toISOString(),
    tags: [...project.data.tags, project.data.domain],
    _type: "project",
  }));
  const noteItems = notes.map((note) => ({
    id: absoluteUrl(`notes/${note.id}/`),
    url: absoluteUrl(`notes/${note.id}/`),
    title: note.data.title,
    summary: note.data.summary,
    date_published: `${note.data.date}T00:00:00Z`,
    tags: note.data.tags,
    _type: "note",
  }));
  const items = [...projectItems, ...noteItems].sort((a, b) => {
    const aDate = a.date_published ?? "";
    const bDate = b.date_published ?? "";
    return bDate.localeCompare(aDate);
  });

  return new Response(
    JSON.stringify(
      {
        version: "https://jsonfeed.org/version/1.1",
        title: "陈陇刚 · 项目与笔记",
        home_page_url: absoluteUrl(""),
        feed_url: absoluteUrl("feed.json"),
        description: "项目案例与技术笔记的 JSON Feed。",
        language: "zh-CN",
        items,
      },
      null,
      2,
    ),
    {
      headers: { "Content-Type": "application/feed+json; charset=utf-8" },
    },
  );
}
