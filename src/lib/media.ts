export function resolveMediaUrl(src: string, base: string): string {
  if (/^https?:\/\//.test(src)) return src;
  const normalizedBase = base.endsWith("/") ? base : base + "/";
  if (normalizedBase !== "/" && src.startsWith(normalizedBase)) return src;
  return normalizedBase + src.replace(/^\/+/, "");
}
