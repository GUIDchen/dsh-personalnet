#!/usr/bin/env node
/**
 * GitHub 项目数据校验：sources 与生成文件一致、字段完整、URL 合法。
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const sources = JSON.parse(
  readFileSync(resolve(root, "src/data/github-project-sources.json"), "utf8"),
);
const generated = JSON.parse(readFileSync(resolve(root, "src/data/github-projects.json"), "utf8"));
const errors = [];

if (!Array.isArray(sources.repos) || sources.repos.length === 0)
  errors.push("sources.repos 不能为空");
if (!Array.isArray(generated.repos) || generated.repos.length === 0)
  errors.push("generated.repos 不能为空");

const sourceNames = new Set();
for (const repo of sources.repos ?? []) {
  for (const key of ["repo", "name", "summaryZh", "summaryEn", "category"]) {
    if (typeof repo[key] !== "string" || !repo[key].trim())
      errors.push(repo.repo + ": 缺少 " + key);
  }
  if (typeof repo.order !== "number") errors.push(repo.repo + ": order 应为数字");
  if (sourceNames.has(repo.repo)) errors.push("重复仓库: " + repo.repo);
  sourceNames.add(repo.repo);
}

const generatedNames = new Set();
for (const repo of generated.repos ?? []) {
  generatedNames.add(repo.repo);
  if (!/^https:\/\/github\.com\/GUIDchen\/[^/]+$/.test(repo.url ?? "")) {
    errors.push(repo.repo + ": url 不合法");
  }
  if (!repo.summaryZh || !repo.summaryEn) errors.push(repo.repo + ": 缺少摘要");
}
for (const name of sourceNames) if (!generatedNames.has(name)) errors.push("生成文件缺少: " + name);
for (const name of generatedNames) if (!sourceNames.has(name)) errors.push("生成文件多出: " + name);

console.log("GitHub 项目校验");
console.log("  源仓库: " + sourceNames.size);
console.log("  生成仓库: " + generatedNames.size);
console.log("  错误: " + errors.length);
if (errors.length) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
