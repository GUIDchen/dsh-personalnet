#!/usr/bin/env node
/**
 * 管理后台配置校验：Sveltia CMS 启动页、字段映射、robots 与资源固定版本。
 * 构建前运行：node scripts/check-admin.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

const errors = [];
const warnings = [];
const root = resolve(process.cwd());

const read = (path) => readFileSync(resolve(root, path), "utf8");
const exists = (path) => existsSync(resolve(root, path));

const expected = {
  projects: [
    "title",
    "summary",
    "domain",
    "tags",
    "role",
    "team",
    "timeframe",
    "status",
    "featured",
    "order",
    "cover",
    "gallery",
    "stack",
    "links",
    "metrics",
    "highlights",
    "draft",
    "seo",
  ],
  notes: ["title", "summary", "date", "tags", "draft"],
};

if (!exists("public/admin/index.html")) errors.push("缺少 public/admin/index.html");
if (!exists("public/admin/config.yml")) errors.push("缺少 public/admin/config.yml");
if (!exists("public/media")) warnings.push("缺少 public/media 目录（CMS 上传时会创建）");

if (exists("public/admin/index.html")) {
  const html = read("public/admin/index.html");
  if (!/<meta[^>]+name="robots"[^>]+content="noindex/i.test(html)) {
    errors.push("admin/index.html 缺少 robots noindex");
  }
  const scriptTag = /<script[^>]+src="([^"]*@sveltia\/cms@([0-9.]+)[^"]*)"[^>]*>/i.exec(html);
  if (!scriptTag) {
    errors.push("admin/index.html 未加载固定版本的 @sveltia/cms");
  } else {
    if (!/integrity="sha384-[A-Za-z0-9+/=]+"/.test(scriptTag[0])) {
      errors.push("Sveltia script 缺少 integrity (SRI)");
    }
    if (!/crossorigin="anonymous"/.test(scriptTag[0])) {
      errors.push("Sveltia script 缺少 crossorigin=anonymous");
    }
  }
}

if (exists("public/admin/config.yml")) {
  let config;
  try {
    config = parse(read("public/admin/config.yml"));
  } catch (error) {
    errors.push("config.yml 无法解析: " + error.message);
  }

  if (config) {
    if (config.backend?.name !== "github") errors.push("backend.name 应为 github");
    if (!config.backend?.repo || !config.backend.repo.includes("/")) {
      errors.push("backend.repo 应为 owner/repo");
    } else if (config.backend.repo.startsWith("OWNER/")) {
      warnings.push("backend.repo 仍是 OWNER 占位；线上模式前需替换");
    }
    if (!config.media_folder || !config.public_folder)
      errors.push("缺少 media_folder/public_folder");

    for (const [name, fields] of Object.entries(expected)) {
      const collection = config.collections?.find((item) => item.name === name);
      if (!collection) {
        errors.push("缺少 collection: " + name);
        continue;
      }
      if (!collection.folder) errors.push(name + " 缺少 folder");
      if (collection.format !== "yaml-frontmatter")
        errors.push(name + " format 应为 yaml-frontmatter");
      if (collection.extension !== "mdx") errors.push(name + " extension 应为 mdx");

      const actual = (collection.fields ?? []).map((field) => field.name);
      const actualWithoutBody = actual.filter((field) => field !== "body");
      const missing = fields.filter((field) => !actualWithoutBody.includes(field));
      const extra = actualWithoutBody.filter((field) => !fields.includes(field));
      if (missing.length > 0) errors.push(name + " 缺少字段: " + missing.join(", "));
      if (extra.length > 0) errors.push(name + " 存在未知字段: " + extra.join(", "));
      if (!actual.includes("body")) errors.push(name + " 缺少 body 字段");

      const body = collection.fields?.find((field) => field.name === "body");
      if (body && !["markdown", "richtext", "text"].includes(body.widget)) {
        errors.push(name + " body 字段类型应为 markdown/richtext/text");
      }
    }

    const notes = config.collections?.find((item) => item.name === "notes");
    const date = notes?.fields?.find((field) => field.name === "date");
    if (date && date.format !== "YYYY-MM-DD") {
      errors.push("notes.date 输出格式应为 YYYY-MM-DD");
    }
  }
}

const robotsPath = exists("dist/robots.txt") ? "dist/robots.txt" : "src/pages/robots.txt.ts";
if (exists(robotsPath)) {
  const robots = read(robotsPath);
  if (!robots.includes("admin/")) errors.push("robots.txt 未禁止 /admin/");
} else {
  warnings.push("未找到 robots 配置");
}

console.log("管理后台校验");
console.log("  错误: " + errors.length);
console.log("  警告: " + warnings.length);
for (const warning of warnings) console.log("  [warn] " + warning);
if (errors.length > 0) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
