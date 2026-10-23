const FALLBACK_SITE = "https://example.com";

/** 拼接站点 base（支持 GitHub Pages 子路径部署）。 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = path.replace(/^\/+/, "");
  return normalized ? `${base}${normalized}` : base;
}

/** 生成绝对 URL，用于 canonical、RSS、JSON-LD。 */
export function absoluteUrl(path: string): string {
  const site = import.meta.env.SITE || FALLBACK_SITE;
  return new URL(withBase(path), site).href;
}

/** 把 "2024.06" 转为 Date（用于 RSS / JSON-LD）。 */
export function toDate(value: string): Date {
  const [year = "1970", month = "01"] = value.split(".");
  return new Date(`${year}-${month.padStart(2, "0")}-01T00:00:00Z`);
}

/** 中文展示的周期，例如 "2023.09 – 2024.01" 或 "2025.07 – 至今"。 */
export function formatPeriod(
  timeframe: { start: string; end?: string; ongoing?: boolean },
  separator = " – ",
): string {
  if (timeframe.ongoing) return `${timeframe.start}${separator}至今`;
  return timeframe.end ? `${timeframe.start}${separator}${timeframe.end}` : timeframe.start;
}

/** 年份区间，用于卡片展示。 */
export function formatYearRange(timeframe: {
  start: string;
  end?: string;
  ongoing?: boolean;
}): string {
  const startYear = timeframe.start.slice(0, 4);
  const endYear = timeframe.end?.slice(0, 4);
  if (timeframe.ongoing) return `${startYear} – 至今`;
  if (!endYear || endYear === startYear) return startYear;
  return `${startYear} – ${endYear}`;
}
