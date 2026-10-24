#!/usr/bin/env node
/**
 * 性能护栏：禁止已证实会造成滚动抖动的 CSS 模式。
 * 背景/头部样式需要变更时，先在真实设备做帧率基准再放行。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const src = resolve(root, "src");
const rules = [
  { pattern: /backdrop-filter\s*:/, name: "backdrop-filter（滚动时重复模糊）" },
  { pattern: /filter\s*:\s*blur\(/, name: "filter: blur（全屏重绘）" },
  { pattern: /animation-timeline\s*:/, name: "animation-timeline（滚动绑定合成）" },
];
const errors = [];
const extensions = /.(?:css|astro|ts|js)$/;
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (extensions.test(entry)) {
      const text = readFileSync(full, "utf8");
      for (const rule of rules) {
        if (rule.pattern.test(text)) errors.push(rule.name + " → " + full.replace(root + "/", ""));
      }
    }
  }
}
walk(src);

console.log("性能护栏检查");
console.log("  错误: " + errors.length);
for (const error of errors) console.log("  [error] " + error);
if (errors.length) process.exit(1);
console.log("通过 ✅");
