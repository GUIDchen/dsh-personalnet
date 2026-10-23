#!/usr/bin/env node
/**
 * 新建项目骨架：node scripts/new-project.mjs <slug>
 * 生成 src/content/projects/<slug>.mdx，并提示后续步骤。
 */
import { existsSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const slug = process.argv[2];

if (!slug) {
  console.error("用法：pnpm new:project <slug>（小写 kebab-case，例如 my-new-project）");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("slug 只能包含小写字母、数字与短横线，例如 my-new-project");
  process.exit(1);
}

const file = join(root, "src/content/projects", slug + ".mdx");
if (existsSync(file)) {
  console.error("文件已存在：" + file);
  process.exit(1);
}

const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, "0");
const start = now.getFullYear() + "." + month;

const content = `---
# TODO: 替换为真实信息；字段约束见 docs/08-content-model.md
title: 待填写：项目标题
summary: 在这里写一句话摘要（20–200 字），说明项目解决的问题、采用的方法与可验证的结果。
domain: data-analytics # ai-llm | computer-vision | data-analytics | embedded-systems | infrastructure | web-engineering | research
tags: [etl] # 必须在 src/data/tags.json 词表内，1–6 个
role: 独立开发
# team: 项目来源或团队（可选）
timeframe: { start: "${start}", ongoing: true }
status: active # active | completed | archived | experimental
featured: false
order: 99
# cover:
#   src: projects/example.png
#   alt: 封面图的替代文本（有 src 时必填）
stack: [Python]
# metrics:
#   - { label: 数据规模, value: "1,000+", unit: 条 }
# links:
#   repo: https://github.com/...
draft: true
---

## 背景与问题

<!-- 为什么做这个项目？要解决什么问题？ -->

## 约束

<!-- 时间、算力、数据、合规等限制。 -->

## 方案与架构

<!-- 整体方案、模块划分或流程。 -->

## 关键决策

<!-- 问题 → 选项 → 选择 → 代价。 -->

## 结果与度量

<!-- 可验证的结果；没有数据时说明验证方式，不编造。 -->

## 反思

<!-- 如果重做，会怎么改？ -->
`;

writeFileSync(file, content);
console.log("已创建：" + file);
console.log("");
console.log("下一步：");
console.log("  1. 填写 frontmatter 与正文，补封面（可选）");
console.log("  2. pnpm dev 预览");
console.log("  3. pnpm test:content 校验");
console.log("  4. pnpm build && pnpm gen:og 重新生成 OG/封面");
console.log("  5. 将 draft 改为 false 并提交 PR");
