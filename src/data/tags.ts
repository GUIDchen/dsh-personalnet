import data from "./tags.json";

/** 标签词表：内容与脚本共用的单一来源（src/data/tags.json）。 */
export const TAG_VOCABULARY: readonly string[] = data.tags;

export function isKnownTag(tag: string): boolean {
  return TAG_VOCABULARY.includes(tag);
}
