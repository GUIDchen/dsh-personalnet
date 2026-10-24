#!/usr/bin/env node
/**
 * 中英文内容完整性检查：每个项目/笔记必须有英文正文，且英文侧栏字段齐全。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";

const root = resolve(process.cwd());
const errors = [];
const warnings = [];
const read = (path) => readFileSync(join(root, path), "utf8");
const frontmatter = (text) => /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);

function checkBodies(sourceDir, bodyDir, label) {
  const sourceFiles = readdirSync(join(root, sourceDir)).filter((f) => f.endsWith(".mdx"));
  const bodyFiles = new Set(readdirSync(join(root, bodyDir)).filter((f) => f.endsWith(".mdx")));
  for (const file of sourceFiles) {
    const source = frontmatter(read(join(sourceDir, file)));
    if (!source) {
      errors.push(label + " 源 frontmatter 无效: " + file);
      continue;
    }
    const meta = parse(source[1]) ?? {};
    if (meta.draft) continue;
    if (!bodyFiles.has(file)) {
      errors.push(label + " 缺少英文正文: " + file);
      continue;
    }
    bodyFiles.delete(file);
    const translated = frontmatter(read(join(bodyDir, file)));
    if (!translated) {
      errors.push(label + " 英文 frontmatter 无效: " + file);
      continue;
    }
    const body = translated[2];
    if (!/^##\s+/m.test(body)) errors.push(label + " 英文正文缺少 H2: " + file);
    if (/[\u4e00-\u9fff]/.test(body)) errors.push(label + " 英文正文仍含中文: " + file);
    if (!meta.titleEn || !meta.summaryEn) errors.push(label + " 缺少 titleEn/summaryEn: " + file);
  }
  for (const orphan of bodyFiles) errors.push(label + " 英文正文无对应中文: " + orphan);
}

checkBodies("src/content/projects", "src/content/projects-en", "项目");
checkBodies("src/content/notes", "src/content/notes-en", "笔记");

for (const file of readdirSync(join(root, "src/content/projects")).filter((f) =>
  f.endsWith(".mdx"),
)) {
  const parsed = frontmatter(read(join("src/content/projects", file)));
  if (!parsed) continue;
  const meta = parse(parsed[1]) ?? {};
  if (meta.draft) continue;
  if (meta.highlights?.length && !meta.highlightsEn?.length)
    errors.push("项目缺少 highlightsEn: " + file);
  if (meta.metrics?.length && !meta.metricsEn?.length) errors.push("项目缺少 metricsEn: " + file);
  if (!meta.roleEn) errors.push("项目缺少 roleEn: " + file);
}

for (const file of readdirSync(join(root, "src/content/notes")).filter((f) => f.endsWith(".mdx"))) {
  const parsed = frontmatter(read(join("src/content/notes", file)));
  if (!parsed) continue;
  const meta = parse(parsed[1]) ?? {};
  if (meta.draft) continue;
  if (meta.takeaways?.length && !meta.takeawaysEn?.length)
    errors.push("笔记缺少 takeawaysEn: " + file);
}

console.log("中英文完整性");
console.log(
  "  项目英文正文: " +
    readdirSync(join(root, "src/content/projects-en")).filter((f) => f.endsWith(".mdx")).length,
);
console.log(
  "  笔记英文正文: " +
    readdirSync(join(root, "src/content/notes-en")).filter((f) => f.endsWith(".mdx")).length,
);
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const warning of warnings) console.log("  [warn] " + warning);
for (const error of errors) console.log("  [error] " + error);
if (errors.length) process.exit(1);
console.log("通过 ✅");
