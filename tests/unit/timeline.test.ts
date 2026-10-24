import { describe, expect, it } from "vitest";
import { buildTimelineRows, domainCounts, parseMonth, timelineYears } from "@/lib/timeline";

const project = (
  id: string,
  start: string,
  end: string | undefined,
  domain = "web-engineering",
) => ({
  id,
  data: {
    title: id,
    domain: domain as never,
    timeframe: { start, end, ongoing: !end },
  },
});

describe("timeline", () => {
  it("parses YYYY.MM", () => {
    expect(parseMonth("2024.01")).toBe(2024);
    expect(parseMonth("2024.07")).toBe(2024.5);
  });

  it("sorts rows and keeps ongoing projects open-ended", () => {
    const rows = buildTimelineRows([
      project("later", "2025.01", "2025.12"),
      project("earlier", "2019.09", "2020.06"),
      project("current", "2024.01", undefined),
    ]);
    expect(rows.map((row) => row.project.id)).toEqual(["earlier", "current", "later"]);
    expect(rows[1]!.width).toBeGreaterThan(0);
    expect(rows[1]!.left).toBeGreaterThan(0);
  });

  it("counts domains and hides empty ones", () => {
    const counts = domainCounts([
      project("a", "2020.01", "2020.02", "web-engineering"),
      project("b", "2020.01", "2020.02", "web-engineering"),
      project("c", "2020.01", "2020.02", "research"),
    ]);
    expect(counts.find((item) => item.id === "web-engineering")?.count).toBe(2);
    expect(counts.find((item) => item.id === "ai-llm")).toBeUndefined();
  });

  it("has 11 year columns from 2016 to 2026", () => {
    expect(timelineYears()).toEqual([
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
    ]);
  });
});
