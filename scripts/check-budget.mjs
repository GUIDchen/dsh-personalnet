#!/usr/bin/env node
/**
 * 体积预算：统计每个页面的 JS / CSS / HTML gzip 体积，以及字体总量。
 * 阈值来自 docs/09-seo-performance-a11y.md。构建后运行：node scripts/check-budget.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, "dist");
const LIMITS = {
  homeJs: 25 * 1024,
  detailJs: 40 * 1024,
  searchJs: 60 * 1024,
  css: 30 * 1024,
  fonts: 120 * 1024,
  html: 60 * 1024,
};

const gzipSize = (buffer) => gzipSync(buffer).length;
const kb = (bytes) => (bytes / 1024).toFixed(1) + "KB";

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const files = walk(DIST);
// 管理后台是独立的第三方 SPA，不计入站点预算。
const htmlFiles = files.filter((file) => file.endsWith(".html") && !file.includes("/admin/"));
const cssFiles = files.filter((file) => file.endsWith(".css"));
const fontFiles = files.filter((file) => /\.woff2?$/.test(file));

const BASE = (process.env.BASE_PATH || "/").replace(/^\/+|\/+$/g, "");

const assetPath = (url) => {
  let clean = url.split("?")[0].replace(/^\/+/, "");
  if (BASE && (clean === BASE || clean.startsWith(BASE + "/"))) {
    clean = clean.slice(BASE.length).replace(/^\/+/, "");
  }
  return join(DIST, clean);
};

const errors = [];
const rows = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const route = "/" + relative(DIST, file).replace(/\\/g, "/");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(
    (match) => match[1],
  );

  const externalJs = [...new Set(scripts)].reduce((total, url) => {
    const path = assetPath(url);
    try {
      return total + gzipSize(readFileSync(path));
    } catch {
      errors.push(route + ": 引用的脚本不存在 " + url);
      return total;
    }
  }, 0);

  // Astro 会把小脚本内联进 HTML：单独统计，避免预算被低估。
  const inline = [
    ...html.matchAll(
      /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ]
    .map((match) => match[1])
    .filter((code) => code.trim().length > 0);
  const inlineJs = inline.length > 0 ? gzipSize(Buffer.from(inline.join("\n"))) : 0;
  const jsBytes = externalJs + inlineJs;

  const cssBytes = [...new Set(styles)].reduce((total, url) => {
    const path = assetPath(url);
    try {
      return total + gzipSize(readFileSync(path));
    } catch {
      errors.push(route + ": 引用的样式不存在 " + url);
      return total;
    }
  }, 0);

  const htmlBytes = gzipSize(Buffer.from(html));
  const isHome = route === "/index.html";
  const isSearch = route === "/search/index.html";
  const isDetail = /^\/projects\/[^/]+\/index\.html$/.test(route);
  const jsLimit = isHome ? LIMITS.homeJs : isSearch ? LIMITS.searchJs : LIMITS.detailJs;

  if (jsBytes > jsLimit) {
    errors.push(`${route}: JS ${kb(jsBytes)} 超过预算 ${kb(jsLimit)}`);
  }
  if (cssBytes > LIMITS.css)
    errors.push(`${route}: CSS ${kb(cssBytes)} 超过预算 ${kb(LIMITS.css)}`);
  if (htmlBytes > LIMITS.html)
    errors.push(`${route}: HTML ${kb(htmlBytes)} 超过预算 ${kb(LIMITS.html)}`);

  rows.push({
    route,
    js: jsBytes,
    css: cssBytes,
    html: htmlBytes,
    kind: isHome ? "首页" : isSearch ? "搜索" : isDetail ? "详情" : "其他",
  });
}

const fontBytes = fontFiles.reduce((total, file) => total + statSync(file).size, 0);
if (fontBytes > LIMITS.fonts) {
  errors.push(`字体总量 ${kb(fontBytes)} 超过预算 ${kb(LIMITS.fonts)}`);
}

const cssTotal = cssFiles.reduce((total, file) => total + gzipSize(readFileSync(file)), 0);

console.log("体积预算（gzip）");
console.log("  页面                JS        CSS       HTML");
for (const row of rows.sort((a, b) => a.route.localeCompare(b.route))) {
  console.log(
    "  " + row.route.padEnd(50) + kb(row.js).padEnd(10) + kb(row.css).padEnd(10) + kb(row.html),
  );
}
console.log("  ---");
console.log(`  全部 CSS: ${kb(cssTotal)}（预算 ${kb(LIMITS.css)}）`);
console.log(`  字体总量: ${kb(fontBytes)}（预算 ${kb(LIMITS.fonts)}）`);
console.log(`  错误: ${errors.length}`);

if (errors.length > 0) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
