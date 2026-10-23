#!/usr/bin/env node
/**
 * 构建产物集成校验：页面数量、元数据唯一性、sitemap/RSS/JSON、OG、Pagefind、内部链接。
 * 构建后运行：node scripts/check-dist.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, "dist");
const BASE = (process.env.BASE_PATH || "/").replace(/\/+$/, "");
const errors = [];
const warnings = [];

/** 去掉部署 base，得到站点根相对路径。 */
function withoutBase(pathname) {
  if (BASE && pathname.startsWith(BASE + "/")) return pathname.slice(BASE.length);
  if (BASE && pathname === BASE) return "/";
  return pathname;
}

const read = (path) => readFileSync(join(DIST, path), "utf8");
const exists = (path) => existsSync(join(DIST, path));

const htmlFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) {
      // 管理后台是 public/ 下的独立 SPA，不参与站点页面/索引检查。
      if (!full.includes("/admin/")) htmlFiles.push(full);
    }
  }
}
walk(DIST);

const routes = htmlFiles.map((file) => "/" + relative(DIST, file).replace(/\\/g, "/"));
const projectRoutes = routes.filter((route) => /^\/projects\/[^/]+\/index\.html$/.test(route));
const noteRoutes = routes.filter((route) => /^\/notes\/[^/]+\/index\.html$/.test(route));

if (projectRoutes.length !== 12) errors.push(`项目详情页应为 12 个，实际 ${projectRoutes.length}`);
if (noteRoutes.length === 0) errors.push("没有生成任何笔记页面");
if (!exists("notes/index.html")) errors.push("缺少笔记列表页 notes/index.html");
if (!exists("404.html")) errors.push("缺少 404.html");

const titles = new Map();
const canonicals = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const route = "/" + relative(DIST, file).replace(/\\/g, "/");
  const title = /<title>(.*?)<\/title>/s.exec(html)?.[1]?.trim();
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];

  if (!title) errors.push(route + ": 缺少 title");
  else {
    if (titles.has(title)) errors.push(`title 重复：${route} 与 ${titles.get(title)}`);
    titles.set(title, route);
  }

  if (!canonical) errors.push(route + ": 缺少 canonical");
  else {
    if (canonicals.has(canonical))
      errors.push(`canonical 重复：${route} 与 ${canonicals.get(canonical)}`);
    canonicals.set(canonical, route);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      errors.push(route + ": JSON-LD 无法解析");
    }
  }
}

// sitemap
const sitemap = exists("sitemap-0.xml") ? read("sitemap-0.xml") : "";
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
// 所有构建页面都应进入 sitemap，仅 search 与 404（含英文版）例外。
const excludedFromSitemap = routes.filter(
  (route) => route.includes("/search/") || route.endsWith("/404.html") || route.includes("/404/"),
).length;
const expectedSitemap = htmlFiles.length - excludedFromSitemap;
if (sitemapUrls.length !== expectedSitemap) {
  errors.push(`sitemap URL 应为 ${expectedSitemap} 个，实际 ${sitemapUrls.length}`);
}
if (sitemapUrls.some((url) => url.includes("/search/"))) errors.push("sitemap 不应包含搜索页");
if (sitemapUrls.some((url) => url.endsWith("/404/"))) errors.push("sitemap 不应包含 404");

// robots
const robots = exists("robots.txt") ? read("robots.txt") : "";
if (!robots) errors.push("缺少 robots.txt");
else {
  const searchDisallow = `Disallow: ${BASE || ""}/search/`;
  if (!robots.includes(searchDisallow)) errors.push("robots.txt 未禁止搜索页");
  if (!/Sitemap: https?:\/\/.+sitemap-index\.xml/.test(robots)) {
    errors.push("robots.txt 未声明 sitemap 绝对地址");
  }
}

// 简历页
if (!exists("cv/index.html")) errors.push("缺少简历页 cv/index.html");

// security.txt
if (!exists(".well-known/security.txt")) errors.push("缺少 .well-known/security.txt");

// RSS
const rss = exists("rss.xml") ? read("rss.xml") : "";
const rssItems = (rss.match(/<item>/g) ?? []).length;
const expectedFeed = projectRoutes.length + noteRoutes.length;
if (rssItems !== expectedFeed) errors.push(`RSS 条目应为 ${expectedFeed}，实际 ${rssItems}`);
if (!rss.includes("<language>zh-cn</language>")) warnings.push("RSS 缺少 language");

// JSON Feed
const feed = exists("feed.json") ? JSON.parse(read("feed.json")) : null;
if (!feed) errors.push("缺少 feed.json");
else {
  if (feed.version !== "https://jsonfeed.org/version/1.1") errors.push("feed.json version 不正确");
  if (!Array.isArray(feed.items) || feed.items.length !== expectedFeed) {
    errors.push(`feed.json 条目应为 ${expectedFeed}，实际 ${feed.items?.length ?? 0}`);
  }
}

// projects.json
const json = exists("projects.json") ? JSON.parse(read("projects.json")) : null;
if (!json) errors.push("缺少 projects.json");
else {
  if (json.count !== 12) errors.push(`projects.json count 应为 12，实际 ${json.count}`);
  if (!json.projects.every((project) => project.slug && project.url && project.domain)) {
    errors.push("projects.json 存在缺少字段的项目");
  }
}

// OG 图
if (!exists("og/default.jpg")) errors.push("缺少默认 OG 图");
for (const slug of json?.projects?.map((project) => project.slug) ?? []) {
  if (!exists(`og/${slug}.jpg`)) errors.push(`缺少 OG 图 og/${slug}.jpg`);
}

// Pagefind
if (!exists("pagefind/pagefind.js")) errors.push("缺少 Pagefind 索引 pagefind/pagefind.js");

// 内部链接
const linkTargets = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/href="(\/[^"#]*?)"/g)) {
    const href = match[1];
    if (href.startsWith("//")) continue;
    linkTargets.add(href);
  }
}
for (const href of linkTargets) {
  const clean = withoutBase(decodeURIComponent(href.split("?")[0]));
  if (clean === "/") continue;
  if (/\.[a-z0-9]+$/i.test(clean) && !clean.endsWith("/")) {
    if (!exists(clean.slice(1))) errors.push("内部链接指向不存在的文件: " + href);
  } else {
    const target = clean.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
    if (!exists(target) && !exists(clean.slice(1))) {
      errors.push("内部链接指向不存在的页面: " + href);
    }
  }
}

console.log("构建产物校验");
console.log("  HTML 页面: " + htmlFiles.length);
console.log("  项目详情: " + projectRoutes.length);
console.log("  sitemap: " + sitemapUrls.length);
console.log("  RSS: " + rssItems);
console.log("  内部链接: " + linkTargets.size);
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const warning of warnings) console.log("  [warn] " + warning);
if (errors.length > 0) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
