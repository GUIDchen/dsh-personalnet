import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, personJsonLd, projectJsonLd, websiteJsonLd } from "../../src/lib/jsonld";
import type { ProjectView } from "../../src/lib/content";

const project = {
  id: "sample-project",
  data: {
    title: "示例项目",
    summary: "这是一个用于测试的项目摘要，长度足够。",
    domain: "ai-llm",
    tags: ["llm", "rag"],
    role: "独立开发",
    timeframe: { start: "2024.01", end: "2024.06", ongoing: false },
    status: "completed",
    featured: true,
    order: 1,
    gallery: [],
    stack: ["TypeScript", "Astro"],
    links: {},
    metrics: [],
    highlights: [],
    draft: false,
  },
} as unknown as ProjectView;

describe("personJsonLd", () => {
  it("声明 Person 类型与绝对 URL", () => {
    const data = personJsonLd();
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBeTruthy();
    expect(data.url).toMatch(/^https?:\/\//);
  });
});

describe("websiteJsonLd", () => {
  it("声明 WebSite 并关联作者", () => {
    const data = websiteJsonLd();
    expect(data["@type"]).toBe("WebSite");
    expect(data.inLanguage).toBe("zh-CN");
    expect(data.author).toHaveProperty("@id");
  });
});

describe("projectJsonLd", () => {
  it("输出 CreativeWork 必填字段", () => {
    const data = projectJsonLd(project, "projects/sample-project/");
    expect(data["@type"]).toBe("CreativeWork");
    expect(data.name).toBe("示例项目");
    expect(data.abstract).toContain("测试");
    expect(data.keywords).toBe("llm, rag");
    expect(data.url).toContain("/projects/sample-project/");
  });
});

describe("breadcrumbJsonLd", () => {
  it("按顺序生成 position", () => {
    const data = breadcrumbJsonLd([
      { name: "首页", path: "/" },
      { name: "项目", path: "/projects/" },
    ]);
    expect(data.itemListElement).toHaveLength(2);
    expect(data.itemListElement[0]?.position).toBe(1);
    expect(data.itemListElement[1]?.position).toBe(2);
  });
});
