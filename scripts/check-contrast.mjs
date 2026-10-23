#!/usr/bin/env node
/**
 * 设计令牌对比度校验：解析 src/styles/tokens.css 的 OKLCH 值，按 WCAG 2.x 计算对比度。
 * 阈值：正文 4.5:1；强调色上的文本 4.5:1；可交互控件边界 3:1。
 * 运行：node scripts/check-contrast.mjs
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

function block(selector) {
  const index = css.indexOf(selector);
  if (index === -1) throw new Error("找不到选择器 " + selector);
  const open = css.indexOf("{", index);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

function parseVars(source) {
  const vars = new Map();
  const re = /--([\w-]+):\s*oklch\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    const parts = match[2].trim().split(/\s+/).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) continue;
    vars.set(match[1], parts);
  }
  return vars;
}

function oklchToLinearRgb([L, C, hDeg]) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return rgb.map((v) => Math.min(1, Math.max(0, v)));
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function contrast(c1, c2) {
  const y1 = luminance(oklchToLinearRgb(c1));
  const y2 = luminance(oklchToLinearRgb(c2));
  const [hi, lo] = y1 > y2 ? [y1, y2] : [y2, y1];
  return (hi + 0.05) / (lo + 0.05);
}

const themes = [
  { name: "亮色", vars: parseVars(block(":root")) },
  { name: "暗色", vars: parseVars(block('[data-theme="dark"]')) },
];

const pairs = [
  { label: "fg / bg", a: "fg", b: "bg", min: 4.5 },
  { label: "muted / bg", a: "muted", b: "bg", min: 4.5 },
  { label: "accent / bg", a: "accent", b: "bg", min: 4.5 },
  { label: "accent-fg / accent", a: "accent-fg", b: "accent", min: 4.5 },
  { label: "border-strong / bg", a: "border-strong", b: "bg", min: 3 },
];

let failed = 0;
for (const theme of themes) {
  console.log(theme.name + ":");
  for (const pair of pairs) {
    const a = theme.vars.get(pair.a);
    const b = theme.vars.get(pair.b);
    if (!a || !b) {
      console.error("  [error] 缺少令牌 " + pair.a + " 或 " + pair.b);
      failed += 1;
      continue;
    }
    const ratio = contrast(a, b);
    const ok = ratio >= pair.min;
    if (!ok) failed += 1;
    const flag = ok ? "ok " : "FAIL";
    console.log(
      "  " + flag + " " + pair.label.padEnd(22) + ratio.toFixed(2) + ":1 (min " + pair.min + ")",
    );
  }
}

if (failed > 0) {
  console.error("\n对比度校验未通过：" + failed + " 项");
  process.exit(1);
}
console.log("\n对比度校验通过 ✅");
