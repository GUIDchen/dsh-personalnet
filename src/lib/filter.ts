import type { ProjectFilter, ProjectLike, SortMode } from "./types";

/** 按领域（单选）与标签（多选，取交集）过滤项目。 */
export function filterProjects<T extends ProjectLike>(
  projects: T[],
  filter: ProjectFilter = {},
): T[] {
  return projects.filter((project) => {
    if (filter.domain && project.domain !== filter.domain) return false;
    if (filter.tags && filter.tags.length > 0) {
      const tags = new Set(project.tags);
      if (!filter.tags.every((tag) => tags.has(tag))) return false;
    }
    return true;
  });
}

/** 排序：精选优先（同权重按 order）、最新（按开始时间倒序）、名称（中文拼音序由 localeCompare 处理）。 */
export function sortProjects<T extends ProjectLike>(
  projects: T[],
  mode: SortMode = "featured",
): T[] {
  const copy = [...projects];
  switch (mode) {
    case "latest":
      return copy.sort((a, b) => b.timeframe.start.localeCompare(a.timeframe.start));
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
    case "featured":
    default:
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.order !== b.order) return a.order - b.order;
        return b.timeframe.start.localeCompare(a.timeframe.start);
      });
  }
}

export interface Facet {
  id: string;
  count: number;
}

/** 统计领域与标签的出现次数，按数量倒序。 */
export function getFacets(projects: ProjectLike[]): { domains: Facet[]; tags: Facet[] } {
  const domainMap = new Map<string, number>();
  const tagMap = new Map<string, number>();
  for (const project of projects) {
    domainMap.set(project.domain, (domainMap.get(project.domain) ?? 0) + 1);
    for (const tag of project.tags) tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
  }
  const toSorted = (map: Map<string, number>): Facet[] =>
    [...map.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  return { domains: toSorted(domainMap), tags: toSorted(tagMap) };
}
