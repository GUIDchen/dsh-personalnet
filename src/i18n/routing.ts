import type { Lang } from "./index";

const BASE = import.meta.env.BASE_URL || "/";

function baseWithoutSlash(): string {
  return BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
}

/** 去掉部署 base，返回以 / 开头的站点内路径。 */
export function stripBase(pathname: string): string {
  const base = baseWithoutSlash();
  if (base && pathname.startsWith(base)) {
    const stripped = pathname.slice(base.length);
    return stripped.startsWith("/") ? stripped : "/" + stripped;
  }
  return pathname.startsWith("/") ? pathname : "/" + pathname;
}

export function getLangFromUrl(pathname: string): Lang {
  const local = stripBase(pathname).replace(/^\/+/, "");
  return local === "en" || local.startsWith("en/") ? "en" : "zh";
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : path + "/";
}

/** 生成带 base 与 locale 的站点路径；path 不带前导斜杠。 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.replace(/^\/+/, "");
  if (lang === "en") {
    return ensureTrailingSlash(`${BASE}en/${clean}`.replace(/\/{2,}/g, "/"));
  }
  return clean ? ensureTrailingSlash(`${BASE}${clean}`.replace(/\/{2,}/g, "/")) : BASE;
}

/** 去掉 en 前缀后的站点内路径（不以 / 开头）。 */
function localWithoutLang(pathname: string): string {
  return stripBase(pathname)
    .replace(/^\/+/, "")
    .replace(/^en\/?/, "");
}

export function isDetailPath(pathname: string): boolean {
  return /^(projects|notes)\/[^/]+\/?$/.test(localWithoutLang(pathname));
}

/** 语言切换目标：详情页没有英文版本，回退到对应英文列表。 */
export function switchLanguagePath(pathname: string, target: Lang): string {
  if (/(^|\/)404(\.html)?\/?$/.test(stripBase(pathname))) {
    return target === "en"
      ? ensureTrailingSlash(`${BASE}en/404/`.replace(/\/{2,}/g, "/"))
      : `${BASE}404.html`;
  }
  const rest = localWithoutLang(pathname);
  const detail = isDetailPath(pathname);

  if (target === "en") {
    if (detail) {
      return ensureTrailingSlash(`${BASE}en/${rest}`.replace(/\/{2,}/g, "/"));
    }
    return rest
      ? ensureTrailingSlash(`${BASE}en/${rest}`.replace(/\/{2,}/g, "/"))
      : ensureTrailingSlash(`${BASE}en`.replace(/\/{2,}/g, "/"));
  }

  return rest ? ensureTrailingSlash(`${BASE}${rest}`.replace(/\/{2,}/g, "/")) : BASE;
}

export interface Alternates {
  zh: string;
  en?: string;
}

/** 输出 zh/en alternate；详情页在 P1 完成后全部有英文正文。 */
export function getAlternates(pathname: string, _lang: Lang): Alternates {
  const zh = switchLanguagePath(pathname, "zh");
  const en = switchLanguagePath(pathname, "en");
  return { zh, en };
}
