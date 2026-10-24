import { describe, expect, it } from "vitest";
import { toDate } from "@/lib/seo";

describe("toDate", () => {
  it("keeps a project month at day one", () => {
    expect(toDate("2023.09").toISOString()).toBe("2023-09-01T00:00:00.000Z");
  });

  it("keeps the full note day", () => {
    expect(toDate("2026-10-23").toISOString()).toBe("2026-10-23T00:00:00.000Z");
  });

  it("accepts dotted full dates", () => {
    expect(toDate("2026.10.23").toISOString()).toBe("2026-10-23T00:00:00.000Z");
  });
});
