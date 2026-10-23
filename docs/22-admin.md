---
文档编号: 22
标题: Sveltia CMS 管理后台
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# Sveltia CMS 管理后台

> 目标：在保持静态架构的前提下，提供浏览器内容编辑。后台只负责编辑与提交，不提供服务器、数据库或公网账号体系。

## 1. 形态

- **本地模式**：Chrome / Edge（Chromium）打开 `http://localhost:4321/admin/index.html`，通过 File System Access API 直接读写工作区文件，无需登录。
- **线上模式**：部署后访问 `https://<site>/admin/`，通过 GitHub backend 提交到仓库；单用户可用 fine-grained PAT，或部署 `sveltia-cms-auth` OAuth Worker。
- **不启用**：自建数据库、服务端会话、多人角色权限。需要这些能力时应重新评估架构（见 ADR 0014）。

## 2. 文件

| 文件 | 作用 |
|---|---|
| `public/admin/index.html` | 后台入口；固定 Sveltia 版本 + SRI + noindex |
| `public/admin/config.yml` | backend、媒体目录、projects/notes 集合与字段 |
| `scripts/check-admin.mjs` | 校验配置字段与 schema 一致、SRI、noindex、robots |
| `tests/e2e/admin.spec.ts` | `/admin/` 200、配置可访问、noindex、robots、sitemap 排除 |

后台是 `public/` 下的静态 HTML，**不要**改成 `src/pages/admin.astro`：Astro 开发服务器会在文件变化时刷新页面，可能打断本地保存（Sveltia 官方也明确不建议）。

## 3. 内容模型

`config.yml` 的字段与 `src/content.config.ts` 一一对应；`check-admin` 会在 CI 中比较字段名。

### projects

| 字段 | 控件 | 说明 |
|---|---|---|
| title | string | 2–40 字 |
| summary | text | 20–200 字 |
| domain | select | 7 个领域枚举 |
| tags | list | 1–6 个，小写/数字/连字符 |
| role / team | string | 角色、团队（选填） |
| timeframe | object | start/end（YYYY.MM）、ongoing |
| status | select | active/completed/archived/experimental |
| featured / order | boolean / number | 首页精选与排序 |
| cover | object | src/alt（选填） |
| gallery | list | 最多 6 张；src 相对 `src/assets/projects/` |
| stack | list | 1–12 项 |
| links | object | repo/demo/paper/doc |
| metrics | list | 最多 4 项 |
| highlights | list | 最多 4 条 |
| draft | boolean | 草稿不进入构建 |
| seo | object | title/description/ogImage（选填） |
| body | markdown | 项目正文（MDX 中的 Markdown 部分） |

### notes

| 字段 | 控件 | 说明 |
|---|---|---|
| title | string | 2–60 字 |
| summary | text | 20–200 字 |
| date | datetime | 输出 `YYYY-MM-DD` |
| tags | list | 0–6 个 |
| draft | boolean | 草稿不进入构建 |
| body | markdown | 笔记正文 |

## 4. 使用流程

### 4.1 本地编辑（推荐日常使用）

1. 启动开发服务器：`pnpm dev`。
2. 用 Chrome 打开 `http://localhost:4321/admin/index.html`（注意是 `index.html`，不是 `/admin/`）。
3. 选择 "Work with local repository"，选中仓库根目录（包含 `package.json` 的那一层）。
4. 编辑项目/笔记，保存后文件直接写入 `src/content/`。
5. 运行 `pnpm test:content && pnpm build` 检查，再按正常 Git 流程提交。

> 本地模式依赖 File System Access API：Chrome/Edge 可用；Safari/Firefox 不支持。保存前保持工作区干净，避免覆盖未提交改动。

### 4.2 线上编辑

1. 把 `public/admin/config.yml` 的 `backend.repo` 从 `OWNER/dsh-personalnet` 改为实际仓库。
2. 选择认证方式：
   - **PAT（最快）**：创建 fine-grained token，只授予目标仓库 `Contents: Read and write`；按 Sveltia 登录提示填入。token 只保存在浏览器本地，不写入仓库。
   - **OAuth（推荐长期）**：部署 [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) Worker，在 backend 增加 `base_url` 指向 Worker。
3. 部署后访问 `/admin/`，登录并编辑；Sveltia 会以 commit 形式写入仓库，触发 CI/部署。

## 5. 安全

- `/admin/` 使用 `noindex, nofollow`，`robots.txt` 禁止抓取，且不进入 sitemap/Pagefind。
- 不在仓库中保存 token、OAuth secret 或环境变量文件。
- PAT 使用最小权限与最短有效期；泄露后立即撤销。
- 后台脚本从固定版本 CDN 加载并带 SRI；若组织有 CSP，需要允许 `unpkg.com`（仅后台页）。
- 内容仍走 Git：所有修改可 diff、可回滚、可审计；后台不是第二套数据源。

## 6. 校验与测试

| 命令 | 内容 |
|---|---|
| `pnpm check:admin` | YAML 解析、集合/字段/schema 对齐、SRI、noindex、robots |
| `pnpm test:e2e --project=webkit tests/e2e/admin.spec.ts` | 后台 200、配置 200、noindex、sitemap 排除、robots |
| `pnpm test:content` | 保存后的 MDX 仍满足 Zod 约束 |

本地文件选择器无法自动化，需按 §4.1 手工验收一次。

## 7. 已知边界

- Sveltia 仍处于 0.x（当前固定 0.250.2）；升级前先看 changelog 并跑 `check:admin` + E2E。
- 后台依赖网络加载 CDN 脚本；离线时无法打开编辑器（本地文件仍可直接改）。
- MDX 只使用 Markdown 语法，不包含 import/组件；若未来引入 MDX 组件，富文本编辑器可能破坏结构，需要改用代码编辑器或自定义字段。
- 字段的细粒度约束（长度、URL、标签正则）仍以 Zod 为最终裁判；后台提示是辅助。
