#!/usr/bin/env node
/**
 * 内容校验：frontmatter 字段、标签词表、领域枚举、六段式结构、隐私敏感信息。
 * 运行：node scripts/check-content.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const PROJECTS_DIR = join(ROOT, "src/content/projects");
const TAGS = new Set(JSON.parse(readFileSync(join(ROOT, "src/data/tags.json"), "utf8")).tags);
const DOMAINS = new Set([
  "ai-llm",
  "computer-vision",
  "data-analytics",
  "embedded-systems",
  "infrastructure",
  "web-engineering",
  "research",
]);
const SECTIONS = ["背景与问题", "约束", "方案与架构", "关键决策", "结果与度量", "反思"];
const SENSITIVE_KEYS = ["phone", "手机号", "年龄", "籍贯", "政治面貌", "身份证", "住址"];

const errors = [];
const warnings = [];

function frontmatter(text, file) {
  if (!text.startsWith("---")) {
    errors.push(file + ": 缺少 frontmatter");
    return "";
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    errors.push(file + ": frontmatter 未闭合");
    return "";
  }
  return text.slice(3, end);
}

const files = readdirSync(PROJECTS_DIR)
  .filter((file) => file.endsWith(".mdx"))
  .sort();
if (files.length === 0) errors.push("src/content/projects 下没有 MDX 文件");

for (const file of files) {
  const path = join(PROJECTS_DIR, file);
  const text = readFileSync(path, "utf8");
  const fm = frontmatter(text, file);

  for (const key of [
    "title",
    "summary",
    "domain",
    "tags",
    "role",
    "timeframe",
    "status",
    "stack",
  ]) {
    if (!new RegExp("^" + key + ":", "m").test(fm)) errors.push(`${file}: 缺少字段 ${key}`);
  }

  const domain = /^domain:\s*(\S+)/m.exec(fm)?.[1];
  if (domain && !DOMAINS.has(domain)) errors.push(`${file}: 非法领域 ${domain}`);

  const tagsLine = /^tags:\s*\[([^\]]*)\]/m.exec(fm)?.[1] ?? "";
  const tags = tagsLine
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.length === 0) errors.push(`${file}: tags 为空`);
  for (const tag of tags) {
    if (!TAGS.has(tag)) errors.push(`${file}: 标签不在词表内 ${tag}`);
  }

  const title = /^title:\s*(.+)$/m.exec(fm)?.[1]?.trim() ?? "";
  if (title.length < 2 || title.length > 40)
    errors.push(`${file}: 标题长度 ${title.length}（2–40）`);

  const summary = /^summary:\s*(.+)$/m.exec(fm)?.[1]?.trim() ?? "";
  if (summary.length < 20 || summary.length > 200) {
    errors.push(`${file}: 摘要长度 ${summary.length}（20–200）`);
  }

  const body = text.slice(text.indexOf("\n---", 3) + 4);
  for (const section of SECTIONS) {
    if (!new RegExp("^## " + section, "m").test(body)) {
      warnings.push(`${file}: 缺少小节「${section}」`);
    }
  }

  if (/^cover:/m.test(fm) && !/^\s+alt:/m.test(fm)) errors.push(`${file}: cover 缺少 alt`);

  if (/1[3-9]\d{9}/.test(text)) errors.push(`${file}: 疑似手机号`);
  for (const key of SENSITIVE_KEYS) {
    if (new RegExp("^" + key + ":", "mi").test(fm)) errors.push(`${file}: 含敏感字段 ${key}`);
  }
}

const domainsUsed = new Set();
for (const file of files) {
  const fm = readFileSync(join(PROJECTS_DIR, file), "utf8");
  const domain = /^domain:\s*(\S+)/m.exec(fm)?.[1];
  if (domain) domainsUsed.add(domain);

  const slug = file.replace(/\.mdx$/, "");
  if (!existsSync(join(ROOT, "public/og", slug + ".jpg"))) {
    errors.push(`${file}: 缺少 OG 图 public/og/${slug}.jpg（运行 pnpm gen:og）`);
  }
}

if (!existsSync(join(ROOT, "public/og/default.jpg"))) {
  errors.push("缺少默认 OG 图 public/og/default.jpg（运行 pnpm gen:og）");
}

console.log("内容校验");
console.log("  项目: " + files.length);
console.log("  领域: " + domainsUsed.size + " / " + DOMAINS.size);
console.log("  标签词表: " + TAGS.size);
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const warning of warnings) console.log("  [warn] " + warning);
if (errors.length > 0) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
