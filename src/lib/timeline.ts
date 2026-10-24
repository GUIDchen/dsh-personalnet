import { DOMAINS } from "@/content.config";

export const TIMELINE_START = 2016;
export const TIMELINE_END = 2027;

export interface TimelineProject {
  id: string;
  data: {
    title: string;
    titleEn?: string;
    domain: (typeof DOMAINS)[number];
    timeframe: { start: string; end?: string; ongoing: boolean };
  };
}

export interface TimelineRow {
  project: TimelineProject;
  left: number;
  width: number;
  start: number;
  end: number;
}

export function parseMonth(value: string): number {
  const [year, month] = value.split(".").map(Number);
  return (year ?? TIMELINE_START) + ((month ?? 1) - 1) / 12;
}

export function timelineYears(): number[] {
  return Array.from(
    { length: TIMELINE_END - TIMELINE_START },
    (_, index) => TIMELINE_START + index,
  );
}

export function buildTimelineRows(projects: TimelineProject[]): TimelineRow[] {
  const span = TIMELINE_END - TIMELINE_START;
  return [...projects]
    .sort((a, b) => parseMonth(a.data.timeframe.start) - parseMonth(b.data.timeframe.start))
    .map((project) => {
      const start = parseMonth(project.data.timeframe.start);
      const end = project.data.timeframe.ongoing
        ? TIMELINE_END
        : parseMonth(project.data.timeframe.end ?? project.data.timeframe.start);
      return {
        project,
        start,
        end,
        left: ((start - TIMELINE_START) / span) * 100,
        width: Math.max(((end - start) / span) * 100, 1.5),
      };
    });
}

export function domainCounts(projects: TimelineProject[]): { id: string; count: number }[] {
  return DOMAINS.map((id) => ({
    id,
    count: projects.filter((project) => project.data.domain === id).length,
  })).filter((item) => item.count > 0);
}
