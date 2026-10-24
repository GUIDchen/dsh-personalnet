#!/usr/bin/env node
/**
 * 隐私检查：拦截手机号、身份证号与敏感 frontmatter 键。
 * 邮箱是允许公开的联系方式；学校/学历/基金号按文档允许。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const targets = ["src/content", "src/data", "docs"];
const rules = [
  { pattern: /(?<!\d)1[3-9]\d{9}(?!\d)/, name: "疑似手机号" },
  { pattern: /(?<!\d)\d{17}[\dXx](?!\d)/, name: "疑似身份证号" },
  {
    pattern: /^(?:phone|mobile|idCard|id_card|homeAddress|home_address|birthDate|birth_date)\s*:/im,
    name: "敏感字段",
  },
];
const errors = [];
const extensions = /\.(?:md|mdx|json|ya?ml|txt)$/;

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
for (const target of targets) walk(resolve(root, target));

console.log("隐私检查");
console.log("  错误: " + errors.length);
for (const error of errors) console.log("  [error] " + error);
if (errors.length) process.exit(1);
console.log("通过 ✅");
