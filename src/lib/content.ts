import { getCollection, type CollectionEntry } from "astro:content";
import { sortProjects } from "./filter";
import type { ProjectLike } from "./types";

export type Project = CollectionEntry<"projects">;

/** 把内容集合条目展开为「可排序字段 + 原始条目」的视图，避免页面重复取值。 */
export type ProjectView = Project & ProjectLike;

function toView(project: Project): ProjectView {
  return {
    ...project,
    title: project.data.title,
    order: project.data.order,
    featured: project.data.featured,
    domain: project.data.domain,
    tags: project.data.tags,
    timeframe: project.data.timeframe,
  };
}

/** 已发布（非草稿）项目，按精选排序。 */
export async function getPublishedProjects(): Promise<ProjectView[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return sortProjects(projects.map(toView), "featured");
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | undefined> {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.id === slug);
}

/** 同领域相关项目，排除自身。 */
export async function getRelatedProjects(project: ProjectView, limit = 3): Promise<ProjectView[]> {
  const projects = await getPublishedProjects();
  return projects
    .filter((item) => item.id !== project.id && item.data.domain === project.data.domain)
    .slice(0, limit);
}

export function projectHref(id: string): string {
  return `${import.meta.env.BASE_URL}projects/${id}/`;
}
