#!/usr/bin/env node
/**
 * 内容证据审计：读取项目 frontmatter，输出缺项表格。非阻塞。
 * 用法：node scripts/content-audit.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";

const root = resolve(process.cwd());
const dir = join(root, "src/content/projects");
const rows = [];

for (const file of readdirSync(dir)
  .filter((name) => name.endsWith(".mdx"))
  .sort()) {
  const text = readFileSync(join(dir, file), "utf8");
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(text)?.[1];
  if (!frontmatter) {
    rows.push({ slug: file.replace(/\.mdx$/, ""), error: "frontmatter 无法解析" });
    continue;
  }
  let data;
  try {
    data = parse(frontmatter);
  } catch (error) {
    rows.push({ slug: file.replace(/\.mdx$/, ""), error: String(error.message) });
    continue;
  }
  const links = data.links ?? {};
  rows.push({
    slug: file.replace(/\.mdx$/, ""),
    repo: Boolean(links.repo),
    cover: Boolean(data.cover?.src),
    gallery: (data.gallery ?? []).length,
    metrics: (data.metrics ?? []).length,
    external: Boolean(links.demo || links.paper || links.doc),
  });
}

const valid = rows.filter((row) => !row.error);
const count = (key) => valid.filter((row) => Boolean(row[key])).length;
const total = valid.length;
const lines = [
  "## 内容证据",
  "",
  `项目 ${total} 个；源码 ${count("repo")}、封面 ${count("cover")}、图库 ${valid.filter((row) => row.gallery > 0).length}、指标 ${valid.filter((row) => row.metrics > 0).length}、外部链接 ${count("external")}。`,
  "",
  "| 项目 | 源码 | 封面 | 图库 | 指标 | Demo/论文/文档 |",
  "|---|---|---|---|---|---|",
  ...rows.map((row) => {
    if (row.error) return `| ${row.slug} | — | — | — | — | ${row.error} |`;
    const mark = (value) => (value ? "✅" : "—");
    return `| ${row.slug} | ${mark(row.repo)} | ${mark(row.cover)} | ${row.gallery || "—"} | ${row.metrics || "—"} | ${mark(row.external)} |`;
  }),
  "",
];

console.log(lines.join("\n"));
