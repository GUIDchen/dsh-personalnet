#!/usr/bin/env node
/**
 * 本地部署到 Cloudflare Pages。
 * 需要 CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID（或在 wrangler login 后的本地 OAuth）。
 * 不会提交 token；只构建 dist 并调用 wrangler。
 */
import { spawnSync } from "node:child_process";

const project = process.env.CLOUDFLARE_PROJECT_NAME || "dsh-personalnet";
const siteUrl = process.env.CLOUDFLARE_SITE_URL || "https://" + project + ".pages.dev";
const env = {
  ...process.env,
  SITE_URL: siteUrl,
  BASE_PATH: "/",
};

console.log("Cloudflare Pages 构建");
console.log("  project: " + project);
console.log("  site: " + siteUrl);

const build = spawnSync("pnpm", ["build"], { stdio: "inherit", env });
if (build.status !== 0) process.exit(build.status ?? 1);

if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error("\n未设置 CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID。");
  console.error("可选：npx wrangler login 后直接运行");
  console.error("  npx wrangler pages deploy dist --project-name=" + project + " --branch=main");
  console.error(
    "或在 GitHub 配置 CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID 后运行 deploy-cloudflare-pages workflow。",
  );
  process.exit(2);
}

const wrangler = "npx";
const base = ["--yes", "wrangler@4.152.0", "pages"];
const create = spawnSync(
  wrangler,
  [...base, "project", "create", project, "--production-branch=main"],
  { stdio: "inherit", env },
);
if (create.status !== 0) {
  console.warn("项目可能已存在或创建失败；继续尝试部署。");
}

const deploy = spawnSync(
  wrangler,
  [...base, "deploy", "dist", "--project-name=" + project, "--branch=main", "--commit-dirty=true"],
  { stdio: "inherit", env },
);
process.exit(deploy.status ?? 1);
