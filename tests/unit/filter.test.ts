import { describe, expect, it } from "vitest";
import { filterProjects, getFacets, sortProjects } from "../../src/lib/filter";
import type { ProjectLike } from "../../src/lib/types";

const base: ProjectLike = {
  title: "项目",
  order: 999,
  featured: false,
  domain: "data-analytics",
  tags: ["etl"],
  timeframe: { start: "2023.01", ongoing: false },
};

const projects: ProjectLike[] = [
  {
    ...base,
    title: "乙项目",
    order: 2,
    featured: false,
    timeframe: { start: "2022.05", ongoing: false },
  },
  {
    ...base,
    title: "甲项目",
    order: 1,
    featured: true,
    domain: "ai-llm",
    tags: ["rag"],
    timeframe: { start: "2024.03", ongoing: true },
  },
  { ...base, title: "丙项目", order: 3, featured: false, tags: ["etl", "cleaning"] },
];

describe("filterProjects", () => {
  it("按领域过滤", () => {
    expect(filterProjects(projects, { domain: "ai-llm" })).toHaveLength(1);
  });

  it("按多个标签取交集", () => {
    expect(filterProjects(projects, { tags: ["etl", "cleaning"] })).toHaveLength(1);
    expect(filterProjects(projects, { tags: ["rag", "etl"] })).toHaveLength(0);
  });
});

describe("sortProjects", () => {
  it("精选优先", () => {
    expect(sortProjects(projects, "featured")[0]?.title).toBe("甲项目");
  });

  it("按开始时间倒序", () => {
    expect(sortProjects(projects, "latest")[0]?.title).toBe("甲项目");
  });

  it("不修改原数组", () => {
    const copy = [...projects];
    sortProjects(projects, "title");
    expect(projects).toEqual(copy);
  });
});

describe("getFacets", () => {
  it("统计领域与标签计数", () => {
    const facets = getFacets(projects);
    expect(facets.domains).toContainEqual({ id: "data-analytics", count: 2 });
    expect(facets.tags).toContainEqual({ id: "etl", count: 2 });
  });
});
