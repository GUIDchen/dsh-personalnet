#!/usr/bin/env node
/**
 * 媒体检查：public/media/projects 的文件大小/格式，以及 MDX 引用是否存在。
 * 构建前运行：node scripts/check-media.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const mediaRoot = join(root, "public/media/projects");
const maxFile = 300 * 1024;
const maxTotal = 8 * 1024 * 1024;
const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);
const errors = [];
const warnings = [];
const files = [];

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry !== ".gitkeep") files.push(full);
  }
}

walk(mediaRoot);

let total = 0;
for (const file of files) {
  const size = statSync(file).size;
  total += size;
  const name = relative(root, file);
  if (!allowed.has(extname(file).toLowerCase())) errors.push(name + ": 不支持的格式");
  if (size > maxFile) errors.push(name + ": " + Math.round(size / 1024) + "KB 超过 300KB");
}
if (total > maxTotal) errors.push("媒体总大小 " + Math.round(total / 1024) + "KB 超过 8MB");

const referenced = new Set();
function scanMdx(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) scanMdx(full);
    else if (entry.endsWith(".mdx")) {
      const text = readFileSync(full, "utf8");
      for (const match of text.matchAll(/\/media\/projects\/[^"'\s)]+/g)) {
        referenced.add(match[0].replace(/^\//, ""));
      }
    }
  }
}
scanMdx(join(root, "src/content/projects"));

for (const ref of referenced) {
  if (!existsSync(join(root, "public", ref))) errors.push("引用不存在: /" + ref);
}

for (const file of files) {
  const rel = relative(join(root, "public"), file).replace(/\\/g, "/");
  if (!referenced.has(rel)) warnings.push("未被引用: /" + rel);
}

console.log("媒体检查");
console.log("  文件: " + files.length);
console.log("  总大小: " + Math.round(total / 1024) + "KB");
console.log("  引用: " + referenced.size);
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const warning of warnings) console.log("  [warn] " + warning);
for (const error of errors) console.log("  [error] " + error);
if (errors.length) process.exit(1);
console.log("通过 ✅");
