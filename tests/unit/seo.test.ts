import { describe, expect, it } from "vitest";
import { formatPeriod, formatYearRange, toDate, withBase } from "../../src/lib/seo";

describe("withBase", () => {
  it("规范化前导斜杠", () => {
    expect(withBase("/projects/")).toBe("/projects/");
    expect(withBase("projects/")).toBe("/projects/");
  });
});

describe("toDate", () => {
  it("解析 YYYY.MM", () => {
    const date = toDate("2024.06");
    expect(date.getUTCFullYear()).toBe(2024);
    expect(date.getUTCMonth()).toBe(5);
    expect(date.getUTCDate()).toBe(1);
  });
});

describe("formatPeriod", () => {
  it("处理进行中与结束时间", () => {
    expect(formatPeriod({ start: "2025.07", ongoing: true })).toBe("2025.07 – 至今");
    expect(formatPeriod({ start: "2023.09", end: "2024.01" })).toBe("2023.09 – 2024.01");
    expect(formatPeriod({ start: "2020.01" })).toBe("2020.01");
  });
});

describe("formatYearRange", () => {
  it("仅保留年份", () => {
    expect(formatYearRange({ start: "2023.09", end: "2024.01" })).toBe("2023 – 2024");
    expect(formatYearRange({ start: "2025.07", ongoing: true })).toBe("2025 – 至今");
    expect(formatYearRange({ start: "2020.01" })).toBe("2020");
  });
});
