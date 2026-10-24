---
文档编号: 36
标题: 数据模型、路由与机器接口契约
状态: Approved
最后更新: 2026-10-24
维护者: 陈陇刚
---

# 数据模型、路由与机器接口契约

本文定义内容数据、URL 与机器可读输出的稳定契约。内容写作规范见 08，SEO 见 09，GitHub 同步见 28。

## 1. 内容集合

| 集合 | 目录 | 用途 | 关键约束 |
|---|---|---|---|
| projects | src/content/projects | 中文项目元数据 + 正文 | 12 个已发布；六段式；domain/tags/stack |
| projects-en | src/content/projects-en | 英文正文（body-only） | 每个项目 1 篇；title/draft + body |
| notes | src/content/notes | 中文笔记元数据 + 正文 | date 严格 YYYY-MM-DD |
| notes-en | src/content/notes-en | 英文正文（body-only） | 每篇笔记 1 篇 |

项目的英文标题/摘要与侧栏字段保留在中文条目（titleEn/summaryEn/roleEn/teamEn/highlightsEn/metricsEn）；英文正文单独存放，避免复制元数据。笔记同理，takeawaysEn 在中文条目。

## 2. 路由契约

| 路径 | 内容 | 索引 | 备注 |
|---|---|---|---|
| / | 中文首页 | 是 | canonical 根 |
| /projects/ | 中文项目库 | 是 | 筛选/排序 URL 状态 |
| /projects/<slug>/ | 中文项目详情 | 是 | 12 个 |
| /notes/<slug>/ | 中文笔记详情 | 是 | 6 个 |
| /en/ | 英文首页 | 是 | hreflang 对等 |
| /en/projects/<slug>/ | 英文项目详情 | 是 | 正文英文 |
| /en/notes/<slug>/ | 英文笔记详情 | 是 | 正文英文 |
| /timeline/、/en/timeline/ | 时间线 | 是 | 静态数据 |
| /experiments/、/en/experiments/ | WebGL 实验 | 是 | 交互演示 |
| /search/、/en/search/ | 站内搜索 | noindex | Pagefind |
| /admin/ | 后台 | noindex/nofollow | token-only |
| /404.html、/en/404/ | 404 | noindex | GitHub Pages 兼容 |

## 3. 机器接口

### 3.1 RSS 2.0：/rss.xml

- Content-Type: application/rss+xml; charset=utf-8
- 频道：标题、链接、描述、语言 zh-CN。
- 条目：项目与笔记合并，按日期倒序；title/link/guid/pubDate/description。
- 日期：项目按 timeframe.start 的完整日期；笔记按 date。
- 兼容：不删除已有字段；新增字段必须向后兼容。

### 3.2 JSON Feed 1.1：/feed.json

- version: https://jsonfeed.org/version/1.1
- home_page_url/feed_url 为绝对 URL。
- items：id/url/title/summary/date_published/tags/_type。
- 语言 zh-CN；与 RSS 并列，不替代 RSS。

### 3.3 项目索引：/projects.json

- generatedAt、count、projects[]。
- 每项：slug/title/titleEn/summary/summaryEn/domain/tags/year/status/url/repo/links。
- 供外部工具/审计使用；字段新增兼容，删除需 major。

### 3.4 其他

| 路径 | 契约 |
|---|---|
| /sitemap-index.xml | 仅可索引页面；含 zh/en |
| /robots.txt | 允许抓取；指向 sitemap |
| /og/<slug>.jpg | 1200×630 Open Graph |
| /.well-known/security.txt | 安全联系与范围 |
| /pagefind/* | 构建期搜索索引，不承诺稳定 API |

## 4. 版本与兼容

- 内容 schema 变更：新增字段可选；删除/改名需迁移脚本 + 版本记录。
- 路由删除/改名：必须保留重定向或发布 major。
- Feed/JSON 字段：新增字段允许；语义变更需在 CHANGELOG 与本文记录。
- 英文正文缺失时构建检查失败；不允许静默回退中文。

## 5. 缓存、安全与失败行为

- /_astro/*：immutable 长缓存；HTML 以部署版本为准。
- Cloudflare 响应头：CSP/HSTS/COOP；GitHub Pages 仅 meta CSP。
- 搜索索引/Feed 构建失败时构建失败，不发布空文件。
- 外部 GitHub 元数据同步失败时保留上次成功数据，不覆盖为空。

## 6. 契约测试

- check:content、check:site、check:media、check:translations。
- tests/unit/seo-date.test.ts、tests/unit/jsonld.test.ts。
- tests/e2e/projects.spec.ts（RSS/projects.json）、i18n.spec.ts（详情/hreflang）。
- check-security 校验响应头配置；部署后用 curl 验证。
