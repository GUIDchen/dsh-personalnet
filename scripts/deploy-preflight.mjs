#!/usr/bin/env node
/**
 * 部署预检：检查远程仓库、部署变量、后台仓库与 Pages 工作流。
 * 用法：pnpm deploy:check
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const errors = [];
const warnings = [];
const info = [];

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

const remote = git(["remote", "get-url", "origin"]);
if (!remote) {
  errors.push("没有 origin remote；先创建 GitHub 仓库并推送 main。");
} else {
  info.push("remote: " + remote);
}

let owner = "";
let repo = "";
if (remote) {
  const match =
    /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/.exec(remote) ?? /^([^/]+)\/([^/]+)$/.exec(remote);
  if (match) {
    owner = match[1];
    repo = match[2].replace(/\.git$/, "");
  } else {
    warnings.push("无法从 remote 解析 GitHub owner/repo，将使用环境变量或占位值。");
  }
}

const isUserPages = owner && repo === owner + ".github.io";
const siteUrl = process.env.SITE_URL || (owner ? `https://${owner}.github.io` : "");
const basePath = process.env.BASE_PATH || (repo ? (isUserPages ? "/" : `/${repo}/`) : "");

if (!siteUrl) errors.push("缺少 SITE_URL，且无法从 remote 推导。");
else if (siteUrl.includes("example.com")) errors.push("SITE_URL 仍是 example.com。");
else info.push("SITE_URL: " + siteUrl);

if (!basePath) errors.push("缺少 BASE_PATH，且无法从 remote 推导。");
else if (!basePath.endsWith("/")) errors.push("BASE_PATH 必须以 / 结尾，例如 /dsh-personalnet/。");
else info.push("BASE_PATH: " + basePath);

if (existsSync(resolve(root, "public/admin/config.yml"))) {
  const config = readFileSync(resolve(root, "public/admin/config.yml"), "utf8");
  if (config.includes("OWNER/dsh-personalnet")) {
    warnings.push("后台 backend.repo 仍是 OWNER 占位；线上编辑前替换为实际仓库。");
  }
}

if (!existsSync(resolve(root, ".github/workflows/deploy.yml"))) {
  errors.push("缺少 .github/workflows/deploy.yml。");
}

const distIndex = resolve(root, "dist/index.html");
if (existsSync(distIndex)) {
  const html = readFileSync(distIndex, "utf8");
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
  if (!canonical.startsWith(siteUrl + basePath.replace(/^\//, ""))) {
    warnings.push(`dist 可能不是当前变量构建的：canonical=${canonical || "(缺失)"}`);
  }
} else {
  warnings.push("dist 不存在；部署前请设置变量后运行 pnpm build。");
}

console.log("部署预检");
for (const line of info) console.log("  " + line);
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const warning of warnings) console.log("  [warn] " + warning);
for (const error of errors) console.log("  [error] " + error);

if (errors.length > 0) {
  console.log("\n未就绪：先创建远程仓库并推送，然后启用 Pages（Source: GitHub Actions）。");
  console.log("可选变量：SITE_URL、BASE_PATH；未设置时 deploy.yml 会按仓库名推导。");
  process.exit(1);
}
console.log("\n通过 ✅ 可以推送 main 触发 deploy workflow。");
