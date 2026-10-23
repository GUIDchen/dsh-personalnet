#!/usr/bin/env node
/**
 * 文档校验：索引完整性、frontmatter 必备字段、相对链接可达、ADR 结构。
 * 无第三方依赖，M0 即可运行：node scripts/check-docs.mjs
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, extname, sep } from "node:path";

const ROOT = resolve(process.cwd());
const DOCS = join(ROOT, "docs");
const ADR_DIR = join(DOCS, "adr");
const errors = [];
const warnings = [];

const rel = (p) => relative(ROOT, p) || ".";

function listMarkdown(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) listMarkdown(full, acc);
    else if (extname(entry) === ".md") acc.push(full);
  }
  return acc;
}

const files = listMarkdown(DOCS).sort();
const indexFile = join(DOCS, "README.md");
const isAdr = (file) => file.startsWith(ADR_DIR + sep);
const adrFiles = files.filter(isAdr);

if (!existsSync(indexFile)) errors.push("缺少 docs/README.md（文档索引）");

/** 读取 YAML frontmatter 顶层键 */
function frontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(3, end);
  const keys = new Set();
  for (const line of block.split("\n")) {
    const match = /^([^\s:#-][^:]*):/.exec(line);
    if (match) keys.add(match[1].trim());
  }
  return { keys, body: text.slice(end + 4) };
}

// 1. frontmatter 与结构
for (const file of files) {
  if (file === indexFile) continue;
  const text = readFileSync(file, "utf8");
  const fm = frontmatter(text);
  if (!fm) {
    errors.push(rel(file) + ": 缺少 frontmatter");
    continue;
  }
  const required = isAdr(file)
    ? ["adr", "标题", "状态", "日期"]
    : ["文档编号", "标题", "状态", "最后更新", "维护者"];
  for (const key of required) {
    if (!fm.keys.has(key)) errors.push(rel(file) + ": frontmatter 缺少字段 " + key);
  }
  if (!/^## /m.test(fm.body)) errors.push(rel(file) + ": 没有二级标题");
  if (fm.body.trim().length < 300) warnings.push(rel(file) + ": 内容过短");
}

// 2. 索引完整性
let indexText = existsSync(indexFile) ? readFileSync(indexFile, "utf8") : "";
const linkedFiles = new Set();
const linkedDirs = new Set();
const linkRe = /\]\((\.[^)\s]+)\)/g;
let m;
while ((m = linkRe.exec(indexText)) !== null) {
  const target = m[1].split("#")[0];
  const abs = resolve(DOCS, target);
  if (existsSync(abs) && statSync(abs).isDirectory()) linkedDirs.add(abs);
  else if (target.endsWith(".md")) linkedFiles.add(abs);
}

for (const file of files) {
  if (file === indexFile) continue;
  if (linkedFiles.has(file)) continue;
  if ([...linkedDirs].some((dir) => file.startsWith(dir + sep))) continue;
  errors.push(rel(file) + ": 未被 docs/README.md 索引");
}

// 3. 相对链接可达
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const re = /\]\(([^)\s]+)\)/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const raw = match[1];
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    const target = raw.split("#")[0];
    if (!target) continue;
    const abs = resolve(dirname(file), target);
    if (!existsSync(abs)) errors.push(rel(file) + ": 死链 " + raw);
  }
}

// 4. ADR 结构
if (!existsSync(ADR_DIR)) {
  errors.push("缺少 docs/adr/ 目录");
} else {
  if (adrFiles.length !== 17) warnings.push("ADR 数量为 " + adrFiles.length + "（预期 17）");
  for (const adr of adrFiles) {
    const text = readFileSync(adr, "utf8");
    for (const section of ["## 背景", "## 决策", "## 后果"]) {
      if (!text.includes(section)) errors.push(rel(adr) + ": 缺少 " + section);
    }
    if (!/^状态: Accepted$/m.test(text)) errors.push(rel(adr) + ": 状态不是 Accepted");
  }
}

// 5. 根文件
for (const f of ["README.md", "LICENSE", "CHANGELOG.md", "CONTRIBUTING.md"]) {
  if (!existsSync(join(ROOT, f))) errors.push("缺少根文件 " + f);
}

const docCount = files.filter((f) => !isAdr(f)).length;
console.log("文档校验");
console.log("  文档文件: " + docCount + "（含索引）");
console.log("  ADR: " + adrFiles.length);
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const w of warnings) console.log("  [warn] " + w);
if (errors.length > 0) {
  for (const e of errors) console.log("  [error] " + e);
  process.exit(1);
}
console.log("通过 ✅");
