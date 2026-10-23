---
文档编号: 28
标题: GitHub 项目索引与同步
状态: Approved
最后更新: 2026-10-24
维护者: 陈陇刚
---

# GitHub 项目索引与同步

## 1. 目标

把作者的公开 GitHub 仓库展示在个人网站上，并让后台可以维护"展示哪些仓库、如何描述"，同时用 GitHub Actions 同步仓库元数据。

## 2. 数据

| 文件 | 作用 |
|---|---|
| `src/data/github-project-sources.json` | 人工维护：仓库名、显示名、中英摘要、分类、排序、精选 |
| `src/data/github-projects.json` | 生成文件：在源数据上补充语言、stars、更新时间、URL、homepage、topics |

- 页面只读生成文件；Sveltia 的 `github` file collection 只编辑源文件。
- `sync-github-projects.mjs` 通过 GitHub API 读取 `GUIDchen` 的公开仓库，按 repo 名合并，保留人工字段。
- 如果源里的仓库不存在/不可见，同步失败，不生成半成品数据。
- 没有加时间戳；元数据不变时生成文件不变，避免无意义 commit。

## 3. 后台联动

1. 在 `/admin/cms/` → GitHub 项目 → 仓库源 中编辑仓库清单。
2. 保存后 Sveltia 提交 `src/data/github-project-sources.json`。
3. `.github/workflows/sync-github-projects.yml` 监听该文件、每周一 03:00 UTC 和手动触发。
4. workflow 运行 `node scripts/sync-github-projects.mjs`，若生成文件变化则提交。
5. push 触发 deploy，网站 `/github/` 更新。

仪表盘提供 GitHub 页面、仓库源编辑、同步 workflow 三个入口。

## 4. 页面

- 中文：`/github/`
- 英文：`/en/github/`
- 卡片：仓库名、中文/英文摘要、分类、语言、更新时间、GitHub 外链。
- 整卡是一个外链，避免嵌套链接；不展示无意义的 stars（当前多为 0）。
- 页脚与命令面板可进入。

## 5. 校验

| 命令 | 内容 |
|---|---|
| `pnpm sync:github` | 拉取 GitHub 元数据并生成 JSON |
| `pnpm check:github` | 源/生成一致、字段、URL、重复项 |
| `pnpm check:admin` | CMS 的 github collection 指向源文件 |
| E2E | 13 个卡片、外链属性、英文摘要、页脚/后台入口 |

## 6. 边界

- 只展示 curated 仓库，不自动把 50 个 fork/课程仓库全部放上。
- 依赖 GitHub API；workflow 使用 `GITHUB_TOKEN`，本地可用匿名额度。
- 仓库改名/删除需要同步更新 sources，否则校验会失败。
- 元数据由 GitHub 提供，页面不伪造 stars/描述；人工摘要由作者维护。
