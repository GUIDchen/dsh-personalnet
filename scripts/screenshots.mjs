/**
 * 本地视觉回归辅助：用 Playwright 对关键页面在 4 个断点截图。
 * 用法：pnpm build && pnpm preview --port 4321 & node scripts/screenshots.mjs
 * 输出：.artifacts/screenshots/（已 gitignore）
 */
import { webkit, chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:4321";
const out = ".artifacts/screenshots";
await mkdir(out, { recursive: true });

let browser;
try {
  browser = await chromium.launch();
} catch {
  browser = await webkit.launch();
}

const shots = [
  { path: "/", w: 390, h: 844, name: "home-390" },
  { path: "/", w: 768, h: 1024, name: "home-768" },
  { path: "/", w: 1280, h: 900, name: "home-1280" },
  { path: "/", w: 1920, h: 1080, name: "home-1920" },
  { path: "/projects/", w: 1280, h: 900, name: "projects-1280" },
  { path: "/projects/", w: 390, h: 844, name: "projects-390" },
  { path: "/search/", w: 1280, h: 900, name: "search-1280" },
  { path: "/projects/yolo-object-detection/", w: 1280, h: 900, name: "detail-1280" },
  { path: "/projects/yolo-object-detection/", w: 390, h: 844, name: "detail-390" },
  { path: "/about/", w: 1280, h: 900, name: "about-1280" },
  { path: "/404.html", w: 1280, h: 900, name: "notfound-1280" },
];

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.w, height: shot.h },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(base + shot.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/${shot.name}.png`, fullPage: true });
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.setItem("theme", "dark"));
await page.reload({ waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${out}/home-1280-dark.png`, fullPage: true });
await context.close();

await browser.close();
console.log("截图完成：" + out);
