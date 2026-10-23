#!/usr/bin/env node
/**
 * 外部链接检查：扫描 dist HTML 中的 http(s) 链接并发起请求。
 * 构建后运行：node scripts/check-links.mjs
 * 说明：403/405 与网络错误记为警告（部分站点/环境拒绝自动请求）；404/410/5xx 记为失败。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const DIST = join(resolve(process.cwd()), "dist");
const links = new Set();

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) {
      const html = readFileSync(full, "utf8");
      // 只检查正文中的 <a> 外链；canonical / JSON-LD 是站点自身地址，不属于外链。
      for (const anchor of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/g)) {
        const url = anchor[1];
        if (url.includes("127.0.0.1") || url.includes("localhost")) continue;
        if (url.startsWith("https://example.com")) continue;
        links.add(url);
      }
    }
  }
}

walk(DIST);

if (links.size === 0) {
  console.log("未发现外部链接");
  process.exit(0);
}

const results = [];
const queue = [...links];

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    return { url, status: response.status, ok: response.status < 400 };
  } catch (error) {
    return { url, status: 0, ok: false, error: String(error).slice(0, 120) };
  } finally {
    clearTimeout(timer);
  }
}

async function worker() {
  while (queue.length > 0) {
    const url = queue.shift();
    if (url) results.push(await check(url));
  }
}

await Promise.all(Array.from({ length: 5 }, worker));

const tolerated = (result) =>
  !result.ok && (result.status === 0 || result.status === 403 || result.status === 405);
const warnings = results.filter(tolerated);
const failures = results.filter((result) => !result.ok && !tolerated(result));
console.log("外部链接检查");
console.log("  链接: " + results.length);
console.log("  失败: " + failures.length);
console.log("  警告: " + warnings.length);
for (const result of results) {
  const mark = result.ok ? "ok  " : tolerated(result) ? "WARN" : "FAIL";
  console.log("  " + mark + " " + result.status + " " + result.url);
}

if (failures.length > 0) process.exit(1);
console.log("通过 ✅");
