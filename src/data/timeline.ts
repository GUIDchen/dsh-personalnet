import data from "./timeline.zh.json";

export type TimelineKind = "工作" | "教育" | "科研";

export interface TimelineItem {
  period: string;
  title: string;
  org: string;
  kind: TimelineKind;
  detail?: string;
}

export const TIMELINE: TimelineItem[] = data.items as TimelineItem[];
