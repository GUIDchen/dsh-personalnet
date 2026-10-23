#!/usr/bin/env node
/**
 * 同步 GitHub 项目元数据：读取人工维护的 sources，补全语言/更新时间/URL 等。
 * 用法：pnpm sync:github（CI 中带 GITHUB_TOKEN）
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const sourcesPath = resolve(root, "src/data/github-project-sources.json");
const outputPath = resolve(root, "src/data/github-projects.json");
const sources = JSON.parse(readFileSync(sourcesPath, "utf8"));
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "dsh-personalnet-github-sync",
};
if (process.env.GITHUB_TOKEN) headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;

const response = await fetch(
  "https://api.github.com/users/GUIDchen/repos?per_page=100&sort=updated",
  {
    headers,
  },
);
if (!response.ok) {
  console.error("GitHub API 请求失败: " + response.status);
  process.exit(1);
}
const repos = await response.json();
const byName = new Map(repos.map((repo) => [repo.name, repo]));
const missing = [];

const projects = sources.repos.map((source) => {
  const repo = byName.get(source.repo);
  if (!repo) {
    missing.push(source.repo);
    return {
      ...source,
      language: "",
      stars: 0,
      updatedAt: "",
      url: "https://github.com/GUIDchen/" + source.repo,
      homepage: "",
      topics: [],
    };
  }
  return {
    ...source,
    language: repo.language ?? "",
    stars: repo.stargazers_count ?? 0,
    updatedAt: repo.pushed_at ? repo.pushed_at.slice(0, 10) : "",
    url: repo.html_url,
    homepage: repo.homepage ?? "",
    topics: repo.topics ?? [],
  };
});

if (missing.length > 0) {
  console.error("以下仓库不存在或不可见: " + missing.join(", "));
  process.exit(1);
}

projects.sort((a, b) => a.order - b.order);
const next = JSON.stringify({ repos: projects }, null, 2) + "\n";
let previous = "";
try {
  previous = readFileSync(outputPath, "utf8");
} catch {
  /* 首次生成 */
}
if (previous === next) {
  console.log("GitHub 项目元数据无变化");
} else {
  writeFileSync(outputPath, next);
  console.log("已更新 src/data/github-projects.json（" + projects.length + " 个项目）");
}
