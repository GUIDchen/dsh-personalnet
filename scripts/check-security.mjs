#!/usr/bin/env node
/**
 * 安全基线检查：security.txt、安全策略文件、常见凭据泄漏模式。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const errors = [];
const read = (path) => readFileSync(resolve(root, path), "utf8");
const exists = (path) => {
  try {
    statSync(resolve(root, path));
    return true;
  } catch {
    return false;
  }
};

if (!exists("SECURITY.md")) errors.push("缺少 SECURITY.md");
if (!exists("public/.well-known/security.txt")) {
  errors.push("缺少 public/.well-known/security.txt");
} else {
  const txt = read("public/.well-known/security.txt");
  for (const field of ["Contact:", "Expires:", "Preferred-Languages:", "Canonical:"]) {
    if (!txt.includes(field)) errors.push("security.txt 缺少 " + field);
  }
  if (!txt.includes("mailto:")) errors.push("security.txt Contact 应为 mailto:");
}

const patterns = [
  [/ghp_[A-Za-z0-9]{30,}/, "GitHub classic token"],
  [/github_pat_[A-Za-z0-9_]{20,}/, "GitHub fine-grained token"],
  [/AKIA[0-9A-Z]{16}/, "AWS access key"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, "Slack token"],
];
const skip = new Set([
  ".git",
  "node_modules",
  "dist",
  ".astro",
  ".lighthouseci",
  "test-results",
  "docs",
]);
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (skip.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/.(?:mjs|js|ts|astro|json|ya?ml|md|html|txt)$/.test(entry)) {
      const text = readFileSync(full, "utf8");
      for (const [pattern, label] of patterns) {
        if (pattern.test(text)) errors.push(label + " 可能泄漏: " + full.replace(root + "/", ""));
      }
    }
  }
}
walk(root);

console.log("安全基线检查");
console.log("  错误: " + errors.length);
for (const error of errors) console.log("  [error] " + error);
if (errors.length) process.exit(1);
console.log("通过 ✅");
