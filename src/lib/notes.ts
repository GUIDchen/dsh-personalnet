import { getCollection, type CollectionEntry } from "astro:content";

export type Note = CollectionEntry<"notes">;

export interface NoteLike {
  id: string;
  data: {
    date: string;
    tags: string[];
    title: string;
  };
}

/** 日期倒序；同日期按 slug 稳定排序。 */
export function compareNotes(a: NoteLike, b: NoteLike): number {
  const byDate = b.data.date.localeCompare(a.data.date);
  return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
}

export async function getPublishedNotes(): Promise<Note[]> {
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  return [...notes].sort(compareNotes);
}

export async function getNoteBySlug(slug: string): Promise<Note | undefined> {
  const notes = await getPublishedNotes();
  return notes.find((note) => note.id === slug);
}

/** 共享标签越多越相关；不足时用最新笔记补齐。 */
export function getRelatedNotes<T extends NoteLike>(note: T, notes: T[], limit = 3): T[] {
  const others = notes.filter((item) => item.id !== note.id);
  const tags = new Set(note.data.tags);
  const scored = others
    .map((item) => ({
      item,
      score: item.data.tags.filter((tag) => tags.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || compareNotes(a.item, b.item));

  return scored.slice(0, limit).map((entry) => entry.item);
}

export interface AdjacentNotes<T> {
  prev?: T;
  next?: T;
}

/** prev 为更新的一篇，next 为更早的一篇（输入需已按日期倒序）。 */
export function getAdjacentNotes<T extends NoteLike>(note: T, notes: T[]): AdjacentNotes<T> {
  const index = notes.findIndex((item) => item.id === note.id);
  if (index === -1) return {};
  return {
    prev: index > 0 ? notes[index - 1] : undefined,
    next: index < notes.length - 1 ? notes[index + 1] : undefined,
  };
}

/** 中文按 300 字/分钟、英文按 200 词/分钟估算，向上取整，最少 1 分钟。 */
export function estimateReadingTime(text: string): number {
  const cjk = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const words = text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const minutes = cjk / 300 + words / 200;
  return Math.max(1, Math.ceil(minutes));
}
