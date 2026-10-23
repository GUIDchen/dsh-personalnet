#!/usr/bin/env node
/**
 * 生成维护健康报告：运行构建产物相关检查，输出 reports/health.md。
 * 用法：pnpm build && pnpm health
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
mkdirSync(resolve(root, "reports"), { recursive: true });

const checks = [
  { name: "内容模型", command: "node scripts/check-content.mjs" },
  { name: "站点资料", command: "node scripts/check-site-data.mjs" },
  { name: "媒体", command: "node scripts/check-media.mjs" },
  { name: "内容证据", command: "node scripts/content-audit.mjs" },
  { name: "SEO", command: "node scripts/check-seo.mjs" },
  { name: "构建产物", command: "node scripts/check-dist.mjs" },
  { name: "管理后台", command: "node scripts/check-admin.mjs" },
  { name: "对比度", command: "node scripts/check-contrast.mjs" },
  { name: "体积预算", command: "node scripts/check-budget.mjs" },
  { name: "内部链接", command: "node scripts/check-links.mjs" },
];

function run(command) {
  const started = Date.now();
  try {
    const output = execFileSync(command, {
      cwd: root,
      shell: true,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 300_000,
      env: { ...process.env, CI: "1" },
    });
    return { ok: true, output, duration: Date.now() - started };
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n");
    return { ok: false, output: output || String(error), duration: Date.now() - started };
  }
}

function git(args, fallback = "unknown") {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim() || fallback;
  } catch {
    return fallback;
  }
}

const results = checks.map((check) => ({ ...check, ...run(check.command) }));
const failed = results.filter((result) => !result.ok);
const generated = new Date().toISOString();
const commit = git(["rev-parse", "--short", "HEAD"]);
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);

const lines = [
  "# 站点维护健康报告",
  "",
  `- 生成时间：${generated}`,
  `- 分支：${branch}`,
  `- Commit：${commit}`,
  `- Node：${process.version}`,
  `- 结论：${failed.length === 0 ? "通过" : `${failed.length} 项失败`}`,
  "",
  "| 检查 | 结果 | 耗时 |",
  "|---|---|---|",
  ...results.map(
    (result) =>
      `| ${result.name} | ${result.ok ? "通过" : "失败"} | ${(result.duration / 1000).toFixed(1)}s |`,
  ),
  "",
];

for (const result of results) {
  const output = result.output.trim().split("\n").slice(-80).join("\n");
  lines.push(
    `<details><summary>${result.name}${result.ok ? "" : "（失败）"}</summary>`,
    "",
    "~~~text",
    output || "(无输出)",
    "~~~",
    "",
    "</details>",
    "",
  );
}

if (failed.length > 0) {
  lines.push("## 失败项", "", ...failed.map((result) => `- ${result.name}`), "");
}

const report = lines.join("\n");
writeFileSync(resolve(root, "reports/health.md"), report + "\n");
console.log(report.split("\n").slice(0, 16).join("\n"));
console.log(`\n报告已写入 reports/health.md（${results.length} 项检查，${failed.length} 项失败）`);

process.exit(failed.length === 0 ? 0 : 1);
