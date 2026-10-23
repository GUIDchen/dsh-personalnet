#!/usr/bin/env node
/**
 * 站点资料 JSON 校验：个人资料、About、Now、Uses、技能、时间线（中英各一份）。
 * 构建前运行：node scripts/check-site-data.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const errors = [];
const read = (file) => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const files = [
  "profile.zh.json",
  "profile.en.json",
  "about.zh.json",
  "about.en.json",
  "now.zh.json",
  "now.en.json",
  "uses.zh.json",
  "uses.en.json",
  "skills.zh.json",
  "skills.en.json",
  "timeline.zh.json",
  "timeline.en.json",
].map((name) => "src/data/" + name);

for (const file of files) {
  if (!existsSync(resolve(root, file))) errors.push("缺少 " + file);
}

function text(value, label, min = 1) {
  if (typeof value !== "string" || value.trim().length < min) {
    errors.push(label + " 必须是非空字符串");
  }
}

function list(value, label, min = 1) {
  if (!Array.isArray(value) || value.length < min) errors.push(label + " 必须至少 " + min + " 项");
}

if (!errors.length) {
  for (const lang of ["zh", "en"]) {
    const profile = read("src/data/profile." + lang + ".json");
    for (const key of [
      "name",
      "role",
      "statement",
      "tagline",
      "bioShort",
      "bio",
      "location",
      "email",
      "availability",
    ]) {
      text(profile[key], "profile." + lang + "." + key);
    }
    if (profile.github && !/^https:\/\/github\.com\//.test(profile.github)) {
      errors.push("profile." + lang + ".github 必须是 github.com 链接");
    }

    const about = read("src/data/about." + lang + ".json");
    list(about.story, "about." + lang + ".story", 1);
    about.story.forEach((p, i) => text(p, "about." + lang + ".story[" + i + "]", 10));

    const now = read("src/data/now." + lang + ".json");
    text(now.updated, "now." + lang + ".updated");
    text(now.intro, "now." + lang + ".intro", 10);
    list(now.sections, "now." + lang + ".sections", 1);
    now.sections.forEach((section, i) => {
      text(section.title, "now." + lang + ".sections[" + i + "].title");
      list(section.items, "now." + lang + ".sections[" + i + "].items", 1);
    });

    const uses = read("src/data/uses." + lang + ".json");
    list(uses.groups, "uses." + lang + ".groups", 1);
    const skill = read("src/data/skills." + lang + ".json");
    list(skill.groups, "skills." + lang + ".groups", 1);
    const timeline = read("src/data/timeline." + lang + ".json");
    list(timeline.items, "timeline." + lang + ".items", 1);
    timeline.items.forEach((item, i) => {
      for (const key of ["period", "title", "org", "kind"]) {
        text(item[key], "timeline." + lang + ".items[" + i + "]." + key);
      }
      if (!["工作", "教育", "科研"].includes(item.kind)) {
        errors.push("timeline." + lang + ".items[" + i + "].kind 非法: " + item.kind);
      }
    });
  }

  const zhNow = read("src/data/now.zh.json");
  const enNow = read("src/data/now.en.json");
  if (zhNow.sections.length !== enNow.sections.length) errors.push("Now 中英 sections 数量不一致");
  const zhSkills = read("src/data/skills.zh.json");
  const enSkills = read("src/data/skills.en.json");
  if (zhSkills.groups.length !== enSkills.groups.length)
    errors.push("Skills 中英 groups 数量不一致");
  const zhTimeline = read("src/data/timeline.zh.json");
  const enTimeline = read("src/data/timeline.en.json");
  if (zhTimeline.items.length !== enTimeline.items.length)
    errors.push("Timeline 中英 items 数量不一致");
}

console.log("站点资料校验");
console.log("  文件: " + files.length);
console.log("  错误: " + errors.length);
if (errors.length) {
  for (const error of errors) console.log("  [error] " + error);
  process.exit(1);
}
console.log("通过 ✅");
