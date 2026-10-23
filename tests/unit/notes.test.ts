import { describe, expect, it } from "vitest";
import {
  compareNotes,
  estimateReadingTime,
  getAdjacentNotes,
  getRelatedNotes,
} from "../../src/lib/notes";

const note = (id: string, date: string, tags: string[] = []) => ({
  id,
  data: { date, tags, title: id },
});

describe("compareNotes", () => {
  it("按日期倒序，同日期按 slug", () => {
    const list = [note("a", "2026-10-01"), note("c", "2026-10-03"), note("b", "2026-10-02")];
    expect([...list].sort(compareNotes).map((item) => item.id)).toEqual(["c", "b", "a"]);
    expect([note("b", "2026-10-03"), note("a", "2026-10-03")].sort(compareNotes)[0]?.id).toBe("a");
  });
});

describe("getRelatedNotes", () => {
  it("优先共享标签，排除自身", () => {
    const current = note("current", "2026-10-03", ["astro", "seo"]);
    const list = [
      current,
      note("one-tag", "2026-10-02", ["astro"]),
      note("two-tags", "2026-10-01", ["astro", "seo"]),
      note("none", "2026-10-04", ["testing"]),
    ];
    expect(getRelatedNotes(current, list, 2).map((item) => item.id)).toEqual([
      "two-tags",
      "one-tag",
    ]);
  });

  it("不足时用最新笔记补齐", () => {
    const current = note("current", "2026-10-03");
    const list = [current, note("older", "2026-10-01"), note("newer", "2026-10-05")];
    expect(getRelatedNotes(current, list, 2).map((item) => item.id)).toEqual(["newer", "older"]);
  });
});

describe("getAdjacentNotes", () => {
  it("prev 更新、next 更早", () => {
    const list = [note("c", "2026-10-03"), note("b", "2026-10-02"), note("a", "2026-10-01")];
    const adjacent = getAdjacentNotes(list[1]!, list);
    expect(adjacent.prev?.id).toBe("c");
    expect(adjacent.next?.id).toBe("a");
  });

  it("首尾边界", () => {
    const list = [note("b", "2026-10-02"), note("a", "2026-10-01")];
    expect(getAdjacentNotes(list[0]!, list).prev).toBeUndefined();
    expect(getAdjacentNotes(list[1]!, list).next).toBeUndefined();
  });
});

describe("estimateReadingTime", () => {
  it("空文本至少 1 分钟", () => {
    expect(estimateReadingTime("")).toBe(1);
  });

  it("纯中文约 300 字/分钟", () => {
    expect(estimateReadingTime("中".repeat(300))).toBe(1);
    expect(estimateReadingTime("中".repeat(301))).toBe(2);
  });

  it("混合文本向上取整", () => {
    expect(estimateReadingTime("中".repeat(150) + " " + "word ".repeat(50))).toBe(1);
    expect(estimateReadingTime("中".repeat(300) + " " + "word ".repeat(200))).toBe(2);
  });
});
