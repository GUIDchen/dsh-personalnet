#!/usr/bin/env node
/**
 * 内容校验：frontmatter 字段、标签词表、领域枚举、六段式结构、隐私敏感信息。
 * 运行：node scripts/check-content.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const PROJECTS_DIR = join(ROOT, "src/content/projects");
const NOTES_DIR = join(ROOT, "src/content/notes");
const LQIP = JSON.parse(readFileSync(join(ROOT, "src/data/cover-placeholders.json"), "utf8"));
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

  const isDraft = /^draft:\s*true/m.test(fm);
  const body = text.slice(text.indexOf("\n---", 3) + 4);
  if (!isDraft) {
    for (const section of SECTIONS) {
      if (!new RegExp("^## " + section, "m").test(body)) {
        warnings.push(`${file}: 缺少小节「${section}」`);
      }
    }
  }

  if (/^cover:/m.test(fm) && !/^\s+alt:/m.test(fm)) errors.push(`${file}: cover 缺少 alt`);

  const hasRepo = /^\s+repo:\s*\S+/m.test(fm);
  const hasRepoVisibility = /^repoVisibility:\s*(public|private|none)/m.test(fm);
  if (!hasRepo && !hasRepoVisibility) {
    warnings.push(`${file}: 缺少 links.repo 或 repoVisibility`);
  }

  if (/1[3-9]\d{9}/.test(text)) errors.push(`${file}: 疑似手机号`);
  for (const key of SENSITIVE_KEYS) {
    if (new RegExp("^" + key + ":", "mi").test(fm)) errors.push(`${file}: 含敏感字段 ${key}`);
  }
}

const domainsUsed = new Set();
let published = 0;
let drafts = 0;
for (const file of files) {
  const fm = readFileSync(join(PROJECTS_DIR, file), "utf8");
  const domain = /^domain:\s*(\S+)/m.exec(fm)?.[1];
  if (domain) domainsUsed.add(domain);

  if (/^draft:\s*true/m.test(fm)) {
    drafts += 1;
    continue;
  }
  published += 1;

  const slug = file.replace(/\.mdx$/, "");
  if (!existsSync(join(ROOT, "public/og", slug + ".jpg"))) {
    errors.push(`${file}: 缺少 OG 图 public/og/${slug}.jpg（运行 pnpm gen:og）`);
  }
  if (!LQIP[slug]) {
    errors.push(`${file}: 缺少 LQIP 占位 src/data/cover-placeholders.json（运行 pnpm gen:og）`);
  }
}

if (!existsSync(join(ROOT, "public/og/default.jpg"))) {
  errors.push("缺少默认 OG 图 public/og/default.jpg（运行 pnpm gen:og）");
}

// 笔记校验：字段、真实日期、标签词表、长度与隐私；笔记不要求六段式与 OG。
let noteFiles = [];
if (existsSync(NOTES_DIR)) {
  noteFiles = readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}
let publishedNotes = 0;
let draftNotes = 0;

for (const file of noteFiles) {
  const path = join(NOTES_DIR, file);
  const text = readFileSync(path, "utf8");
  const fm = frontmatter(text, file);

  for (const key of ["title", "summary", "date"]) {
    if (!new RegExp("^" + key + ":", "m").test(fm)) errors.push(`${file}: 缺少字段 ${key}`);
  }

  const date = /^date:\s*"?([^"\n]+)"?$/m.exec(fm)?.[1]?.trim() ?? "";
  if (date) {
    const parsed = new Date(date + "T00:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsed.getTime()) ||
      !parsed.toISOString().startsWith(date)
    ) {
      errors.push(`${file}: 日期无效 ${date}`);
    }
  }

  const tagsLine = /^tags:\s*\[([^\]]*)\]/m.exec(fm)?.[1] ?? "";
  const tags = tagsLine
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  for (const tag of tags) {
    if (!TAGS.has(tag)) errors.push(`${file}: 标签不在词表内 ${tag}`);
  }

  const title = /^title:\s*(.+)$/m.exec(fm)?.[1]?.trim() ?? "";
  if (title.length < 2 || title.length > 60) {
    errors.push(`${file}: 标题长度 ${title.length}（2–60）`);
  }

  const summary = /^summary:\s*(.+)$/m.exec(fm)?.[1]?.trim() ?? "";
  if (summary.length < 20 || summary.length > 200) {
    errors.push(`${file}: 摘要长度 ${summary.length}（20–200）`);
  }

  if (/1[3-9]\d{9}/.test(text)) errors.push(`${file}: 疑似手机号`);
  for (const key of SENSITIVE_KEYS) {
    if (new RegExp("^" + key + ":", "mi").test(fm)) errors.push(`${file}: 含敏感字段 ${key}`);
  }

  if (/^draft:\s*true/m.test(fm)) draftNotes += 1;
  else publishedNotes += 1;
}

console.log("内容校验");
console.log("  项目: " + published + "（草稿 " + drafts + "）");
console.log("  笔记: " + publishedNotes + "（草稿 " + draftNotes + "）");
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
