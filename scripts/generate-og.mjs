/**
 * 生成社交分享图与项目封面：
 * - public/og/*.jpg        1200×630  OG 图
 * - src/assets/covers/*.jpg 1600×1000 项目封面（交给 astro:assets 优化）
 * 依赖构建产物 dist/projects.json；运行前先 pnpm build。
 * 用法：pnpm gen:og
 * 注意：Linux/CI 环境需要 CJK 字体（如 fonts-noto-cjk），否则中文会显示为方框。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium, webkit } from "@playwright/test";
import sharp from "sharp";

const DOMAIN_LABELS = {
  "ai-llm": "大模型 / NLP",
  "computer-vision": "计算机视觉",
  "data-analytics": "数据分析",
  "embedded-systems": "嵌入式 / 端侧",
  infrastructure: "基础设施 / 运维",
  "web-engineering": "Web 工程",
  research: "科研项目",
};

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );

const FONT_STACK =
  '"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", "HarmonyOS Sans SC", sans-serif';
const MONO_STACK = '"SFMono-Regular", "Menlo", "Consolas", monospace';

const page = (width, height, body, extraCss = "") => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: ${width}px; height: ${height}px; overflow: hidden;
    font-family: ${FONT_STACK};
    background: radial-gradient(120% 120% at 0% 0%, #241a16 0%, #0b0c0e 55%, #0b0c0e 100%);
    color: #f2efe9;
  }
  .accent {
    position: absolute; left: 0; top: 0; width: 10px; height: ${height}px;
    background: linear-gradient(180deg, #e4572e 0%, #f5a524 100%);
  }
  ${extraCss}
</style>
</head>
<body>${body}</body>
</html>`;

const ogCard = ({ index, domain, title, description, footer }) =>
  page(
    1200,
    630,
    `<div id="card">
      <span class="accent"></span>
      <div class="top"><span class="index">${escapeHtml(index)}</span><span class="domain">${escapeHtml(domain)}</span></div>
      <h1>${escapeHtml(title)}</h1>
      <p class="desc">${escapeHtml(description)}</p>
      <div class="bottom">
        <div class="footer-left"><span class="mark">陈</span><span>陈陇刚 · CHEN LONGGANG</span></div>
        <span>${escapeHtml(footer)}</span>
      </div>
    </div>`,
    `#card { position: relative; width: 1200px; height: 630px; padding: 72px 80px 64px; display: flex; flex-direction: column; }
     .top { display: flex; align-items: baseline; justify-content: space-between; }
     .index { font-family: ${MONO_STACK}; font-size: 30px; color: #8b8681; letter-spacing: 0.08em; }
     .domain { font-family: ${MONO_STACK}; font-size: 22px; letter-spacing: 0.12em; color: #e4572e; }
     h1 { margin: 48px 0 0; font-size: 68px; line-height: 1.18; letter-spacing: -0.02em; max-width: 980px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
     .desc { margin: 24px 0 0; font-size: 28px; line-height: 1.6; color: #b8b2a9; max-width: 900px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
     .bottom { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 28px; border-top: 1px solid #2f3033; font-size: 22px; color: #b8b2a9; }
     .footer-left { display: flex; align-items: center; gap: 14px; }
     .mark { display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 8px; background: #f2efe9; color: #0b0c0e; font-size: 20px; font-weight: 600; }`,
  );

const coverCard = ({ index, domain, title, description, footer }) =>
  page(
    1600,
    1000,
    `<div id="cover">
      <span class="accent"></span>
      <div class="rule"></div>
      <div class="top"><span class="index">${escapeHtml(index)}</span><span class="domain">${escapeHtml(domain)}</span></div>
      <p class="desc">${escapeHtml(description)}</p>
      <h1>${escapeHtml(title)}</h1>
      <div class="bottom">
        <div class="footer-left"><span class="mark">陈</span><span>陈陇刚 · CHEN LONGGANG</span></div>
        <span>${escapeHtml(footer)}</span>
      </div>
    </div>`,
    `#cover {
       position: relative; width: 1600px; height: 1000px; padding: 96px 112px 88px;
       display: flex; flex-direction: column;
       background-image:
         linear-gradient(#ffffff08 1px, transparent 1px),
         linear-gradient(90deg, #ffffff08 1px, transparent 1px);
       background-size: 112px 112px;
     }
     .rule { position: absolute; left: 112px; right: 112px; top: 300px; height: 1px; background: #ffffff14; }
     .top { display: flex; align-items: baseline; justify-content: space-between; }
     .index { font-family: ${MONO_STACK}; font-size: 40px; color: #8b8681; letter-spacing: 0.08em; }
     .domain { font-family: ${MONO_STACK}; font-size: 28px; letter-spacing: 0.12em; color: #e4572e; }
     .desc {
       margin: auto 0 28px; font-size: 34px; line-height: 1.65; color: #b8b2a9; max-width: 1200px;
       display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
     }
     h1 {
       margin: 0; font-size: 84px; line-height: 1.22; letter-spacing: -0.025em;
       max-width: 1300px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
     }
     .bottom { margin-top: 64px; display: flex; align-items: center; justify-content: space-between; padding-top: 32px; border-top: 1px solid #2f3033; font-size: 26px; color: #b8b2a9; }
     .footer-left { display: flex; align-items: center; gap: 16px; }
     .mark { display: inline-grid; place-items: center; width: 48px; height: 48px; border-radius: 10px; background: #f2efe9; color: #0b0c0e; font-size: 24px; font-weight: 600; }`,
  );

async function launch() {
  try {
    return await chromium.launch();
  } catch {
    return await webkit.launch();
  }
}

const payload = JSON.parse(await readFile("dist/projects.json", "utf8"));
const browser = await launch();
const pageInstance = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await mkdir("public/og", { recursive: true });
await mkdir("src/assets/covers", { recursive: true });

const placeholders = {};

async function toLqip(buffer) {
  const small = await sharp(buffer).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${small.toString("base64")}`;
}

async function render(html, width, height, path) {
  await pageInstance.setViewportSize({ width, height });
  await pageInstance.setContent(html, { waitUntil: "load" });
  await pageInstance.evaluate(() => document.fonts.ready);
  const buffer = await pageInstance.screenshot();
  await sharp(buffer).jpeg({ quality: 82, mozjpeg: true }).toFile(path);
  return buffer;
}

await render(
  ogCard({
    index: "PROFILE",
    domain: "个人网站",
    title: "陈陇刚 · 人工智能 / 数据分析 / 软件工程",
    description: "用工程方法把数据、模型与系统落到可用的产品里。",
    footer: "7 个领域 · 12 个项目案例",
  }),
  1200,
  630,
  "public/og/default.jpg",
);

const defaultCover = await render(
  coverCard({
    index: "PROFILE",
    domain: "个人网站",
    title: "陈陇刚 · 人工智能 / 数据分析 / 软件工程",
    description: "用工程方法把数据、模型与系统落到可用的产品里。",
    footer: "7 个领域 · 12 个项目案例",
  }),
  1600,
  1000,
  "src/assets/covers/default.jpg",
);
placeholders.default = await toLqip(defaultCover);

for (const [position, project] of payload.projects.entries()) {
  const index = String(position + 1).padStart(2, "0");
  const domain = DOMAIN_LABELS[project.domain] ?? project.domain;
  const footer = `${project.year} · 项目案例`;

  await render(
    ogCard({ index, domain, title: project.title, description: project.summary, footer }),
    1200,
    630,
    `public/og/${project.slug}.jpg`,
  );

  const coverBuffer = await render(
    coverCard({ index, domain, title: project.title, description: project.summary, footer }),
    1600,
    1000,
    `src/assets/covers/${project.slug}.jpg`,
  );
  placeholders[project.slug] = await toLqip(coverBuffer);
}

await writeFile("src/data/cover-placeholders.json", JSON.stringify(placeholders, null, 2) + "\n");

await browser.close();
console.log(
  `已生成 ${payload.projects.length + 1} 张 OG 图与 ${payload.projects.length + 1} 张封面`,
);
