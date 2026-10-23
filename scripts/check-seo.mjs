#!/usr/bin/env node
/**
 * 中文 SEO 审计：标题宽度、描述长度、唯一性、语言、H1、canonical 与社交卡片。
 * 构建后运行：node scripts/check-seo.mjs
 * noindex 页面（search / 404）跳过长度与唯一性规则。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const DIST = join(resolve(process.cwd()), "dist");
const errors = [];
const checked = [];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (entry.endsWith(".html")) acc.push(full);
  }
  return acc;
}

const CJK = /[\u3400-\u9fff\uf900-\ufaff]/;
function displayWidth(text) {
  let width = 0;
  for (const char of text) width += CJK.test(char) ? 2 : 1;
  return width;
}

const metaContent = (html, name) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (tag.includes(`name="${name}"`) || tag.includes(`property="${name}"`)) {
      const content = /content="([^"]*)"/i.exec(tag)?.[1];
      if (content !== undefined) return content;
    }
  }
  return undefined;
};

const titles = new Map();
const descriptions = new Map();

for (const file of walk(DIST)) {
  const html = readFileSync(file, "utf8");
  const route = "/" + relative(DIST, file).replace(/\\/g, "/");
  const noindex = (metaContent(html, "robots") ?? "").includes("noindex");

  const lang = /<html\b[^>]*\slang="([^"]+)"/i.exec(html)?.[1];
  if (lang !== "zh-CN" && lang !== "en") {
    errors.push(`${route}: html lang 应为 zh-CN 或 en，实际 ${lang ?? "缺失"}`);
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) errors.push(`${route}: H1 应为 1 个，实际 ${h1Count}`);

  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim().replace(/\s+/g, " ");
  const description = metaContent(html, "description")?.trim();

  if (!title) errors.push(`${route}: 缺少 title`);
  if (!description) errors.push(`${route}: 缺少 description`);

  if (!noindex) {
    if (title) {
      const width = displayWidth(title);
      if (width < 8 || width > 64) {
        errors.push(`${route}: title 显示宽度 ${width}（8–64）：${title}`);
      }
      const key = title.toLowerCase();
      if (titles.has(key)) errors.push(`${route}: title 与 ${titles.get(key)} 重复`);
      titles.set(key, route);
    }

    if (description) {
      const length = [...description].length;
      if (length < 20 || length > 160) {
        errors.push(`${route}: description 长度 ${length}（20–160）`);
      }
      const key = description.toLowerCase();
      if (descriptions.has(key))
        errors.push(`${route}: description 与 ${descriptions.get(key)} 重复`);
      descriptions.set(key, route);
    }
  }

  if (!/<link[^>]*rel="canonical"/i.test(html)) errors.push(`${route}: 缺少 canonical`);
  if (!metaContent(html, "og:image")) errors.push(`${route}: 缺少 og:image`);
  if (!metaContent(html, "twitter:card")) errors.push(`${route}: 缺少 twitter:card`);

  checked.push({ route, noindex, title, description });
}

console.log("SEO 审计");
console.log("  页面: " + checked.length);
console.log("  可索引: " + checked.filter((item) => !item.noindex).length);
console.log("  错误: " + errors.length);

if (errors.length > 0) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
