---
adr: 0014
标题: 使用 Sveltia CMS 作为静态管理后台
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0014：使用 Sveltia CMS 作为静态管理后台

## 状态

Accepted（2026-10-23）

## 背景

站点是纯静态输出，内容以 MDX + Git 管理。需要降低非命令行编辑成本，但不希望引入数据库、会话服务与长期运维。

## 决策驱动因素

- 保持静态架构与零运行时后端。
- 内容仍以 Git 为唯一事实来源，可 diff/回滚。
- 支持本地直接编辑与线上 GitHub 提交两种模式。
- 开源、可自托管资源、配置简单。

## 考虑过的选项

- **纯 Git（现状）**：零依赖，但编辑门槛高。
- **Sveltia CMS**：静态 `/admin/`，Git backend，支持本地 File System Access 与 GitHub；MIT；0.x。
- **Keystatic**：Astro 集成好，但 GitHub 模式通常需要 SSR/适配器，超出当前静态部署。
- **Decap CMS**：成熟，历史包袱与 UI 较旧，配置兼容但体验不如 Sveltia。
- **自建全栈后台（Hono/Fastify + DB + 登录）**：可公网多用户，但需要服务器、数据库、备份与安全维护。

## 决策

采用 Sveltia CMS 作为内容管理后台：

- 静态文件放在 `public/admin/`，不经过 Astro 页面渲染。
- 内容模型与 Zod schema 对齐，由 `check-admin` 在 CI 中校验。
- 本地模式作为日常编辑方式；线上模式使用 GitHub backend（PAT 或 OAuth Worker）。
- 不引入数据库或自建认证服务。

## 后果

### 正面

- 架构保持静态，部署与回滚方式不变。
- 编辑体验接近 CMS，但内容仍是 MDX。
- 本地模式无需账号与网络即可工作。

### 负面

- 依赖第三方脚本（固定版本 + SRI），存在 CDN 可用性风险。
- 0.x 版本可能有不兼容变更，需要固定版本并定期验证。
- 本地模式仅支持 Chromium 浏览器。
- 线上认证仍需用户配置 GitHub token/Worker，不是开箱即用的多用户后台。
