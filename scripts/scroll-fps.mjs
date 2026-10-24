#!/usr/bin/env node
/**
 * 滚动帧率探测（本机 Chromium 基线，不等于真机/GPU 结论）。
 * 用法：pnpm build && pnpm preview --port 4321，然后 pnpm perf:scroll
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4321";
const paths = ["/", "/projects/", "/github/"];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

for (const path of paths) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + path, { waitUntil: "networkidle" });
  const result = await page.evaluate(async () => {
    const gaps = [];
    let last = performance.now();
    let running = true;
    const tick = (now) => {
      gaps.push(now - last);
      last = now;
      if (running) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    for (let i = 0; i < 120; i++) {
      window.scrollBy(0, 24);
      await new Promise((resolve) => setTimeout(resolve, 16));
    }
    running = false;
    gaps.sort((a, b) => a - b);
    const pct = (q) => gaps[Math.floor(gaps.length * q)] ?? 0;
    return {
      frames: gaps.length,
      p50: Number(pct(0.5).toFixed(2)),
      p95: Number(pct(0.95).toFixed(2)),
      max: Number((gaps.at(-1) ?? 0).toFixed(2)),
    };
  });
  results.push({ path, ...result });
  await page.close();
  console.log(path, JSON.stringify(result));
}
await browser.close();
mkdirSync(resolve("reports"), { recursive: true });
writeFileSync(resolve("reports/scroll-fps.json"), JSON.stringify({ base, results }, null, 2));
console.log("报告：reports/scroll-fps.json");
