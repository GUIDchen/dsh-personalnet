import { describe, expect, it } from "vitest";
import { TAG_VOCABULARY, isKnownTag } from "../../src/data/tags";

describe("标签词表", () => {
  it("无重复项", () => {
    expect(new Set(TAG_VOCABULARY).size).toBe(TAG_VOCABULARY.length);
  });

  it("全部为小写短横线格式", () => {
    for (const tag of TAG_VOCABULARY) {
      expect(tag).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("isKnownTag 只接受词表内标签", () => {
    expect(isKnownTag("yolo")).toBe(true);
    expect(isKnownTag("not-a-tag")).toBe(false);
  });
});
