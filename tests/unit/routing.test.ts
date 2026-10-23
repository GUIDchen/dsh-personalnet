import { describe, expect, it } from "vitest";
import {
  getAlternates,
  getLangFromUrl,
  isDetailPath,
  localizePath,
  switchLanguagePath,
} from "@/i18n/routing";

describe("i18n routing", () => {
  it("识别中英文路径", () => {
    expect(getLangFromUrl("/")).toBe("zh");
    expect(getLangFromUrl("/projects/")).toBe("zh");
    expect(getLangFromUrl("/en/")).toBe("en");
    expect(getLangFromUrl("/en/projects/")).toBe("en");
  });

  it("生成本地化路径", () => {
    expect(localizePath("", "zh")).toBe("/");
    expect(localizePath("", "en")).toBe("/en/");
    expect(localizePath("projects/", "zh")).toBe("/projects/");
    expect(localizePath("projects/", "en")).toBe("/en/projects/");
  });

  it("切换语言并保持路径", () => {
    expect(switchLanguagePath("/about/", "en")).toBe("/en/about/");
    expect(switchLanguagePath("/en/about/", "zh")).toBe("/about/");
  });

  it("详情页回退到列表", () => {
    expect(isDetailPath("/projects/yolo/")).toBe(true);
    expect(switchLanguagePath("/projects/yolo/", "en")).toBe("/en/projects/");
    expect(switchLanguagePath("/notes/why-astro-7/", "en")).toBe("/en/notes/");
    expect(getAlternates("/projects/yolo/", "zh")).toEqual({ zh: "/projects/yolo/" });
  });

  it("列表页有中英文对等链接", () => {
    expect(getAlternates("/projects/", "zh")).toEqual({
      zh: "/projects/",
      en: "/en/projects/",
    });
  });
});
