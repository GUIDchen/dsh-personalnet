# Changelog

本项目的所有重要变更记录在此文件。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- 优秀个人网站基准调研与差距分析（docs/18）：8 个站点 + 5 个开源仓库的实测数据、差距矩阵与 v1.3 改进路线。

## [1.2.0] - 2026-10-23

内容与发现性版本：新增技术笔记、中文 SEO 审计与封面 LQIP。

### Added

- 技术笔记：`notes` 集合、`/notes/` 列表与 `/notes/<slug>/` 详情，含阅读时长、TOC、上/下一篇、相关笔记与 `BlogPosting` 结构化数据。
- 3 篇种子笔记（Astro 选型、Pagefind 搜索、CI 质量门禁），可自由替换。
- 首页“最近笔记”、顶部导航与页脚入口。
- RSS 合并项目与笔记，按日期倒序、最多 20 条。
- 中文 SEO 审计 `pnpm test:seo`：标题显示宽度、描述长度、唯一性、H1、语言与社交元数据。
- 封面 LQIP：24px WebP 内联占位，详情页首帧即有背景。
- 测试扩容：单元 26 项、E2E 34 项、axe 9 页、Lighthouse 6 页。

### Changed

- 顶部导航扩展为 5 项（新增“笔记”）；页脚新增笔记与 RSS。
- RSS 条目由 12 条变为 15 条，标题改为“项目与笔记”；依赖条目数的消费方需注意。
- 首页标题改为“陈陇刚 — 人工智能 / 数据分析 / 软件工程”；Meta 不再重复追加站点名。

### Fixed

- 平板宽度下首页联系信息换行错位（事实网格改为两列，邮箱占满一行）。
- 简历页描述过短导致的 SEO 审计失败。
- 组件目录中的过期交互钩子说明。

## [1.1.0] - 2026-10-23

维护基线版本：补齐日常运营所需的能力与文档。

### Added

- 简历页 `/cv`：A4 打印样式（隐藏站点外壳、黑白适配），可从关于页进入并导出 PDF。
- `/robots.txt` 端点：声明 sitemap 绝对地址、禁止搜索页抓取。
- `pnpm new:project <slug>`：生成带字段注释的草稿骨架，草稿不参与构建。
- `pnpm check:links`：扫描构建产物中的外部链接。
- 维护手册 `docs/17`：发布清单、依赖升级、内容运营、质量回归日历、备份与故障处理。

### Changed

- 内容校验支持草稿：草稿跳过 OG 与小节完整性检查。
- 测试与检查扩容：E2E 26 项、axe 7 页、Lighthouse 5 页、sitemap 16 个 URL。

## [1.0.0] - 2026-10-23

首个可开源版本：个人网站上线所需的内容、设计、交互、质量门禁与文档全部就绪。

### Added

- 站点：首页、项目库、项目详情、关于、搜索、404，响应式 390–1920px，深浅双主题。
- 内容：12 个真实项目案例覆盖 7 个领域；Zod schema 校验 + 内容 lint（字段、长度、标签词表、隐私）。
- 设计系统：OKLCH 令牌、对比度校验、自托管 Geist / JetBrains Mono 拉丁子集、滚动驱动入场。
- 交互：项目领域/标签筛选、三种排序、URL 状态同步、无 JavaScript 降级；Pagefind 全站搜索与 ⌘K / Ctrl+K 唤起。
- 导航：ClientRouter 视图过渡；主题、菜单、筛选脚本在客户端导航后重新初始化。
- 元数据：Person / WebSite / CreativeWork / BreadcrumbList JSON-LD、canonical、OG/Twitter 卡片。
- 资源：13 张 1200×630 OG 图；13 张 1600×1000 封面经 astro:assets 输出 AVIF/WebP/JPG（4 个宽度）。
- 机器可读输出：/rss.xml、/projects.json、/sitemap-index.xml、/robots.txt。
- 工程：Astro 7 + TypeScript 6 + Tailwind CSS 4 + MDX，pnpm 锁定依赖。
- 质量门禁：ESLint 10 / Prettier 3 / astro check / Vitest（17 项，覆盖率 98.3%）/ Playwright（22 项）/ axe（6 页）/ Lighthouse CI（4 页全 1.0）。
- 预算：首页 JS 6.0KB、详情 6.0KB、搜索 7.6KB、CSS 5.6KB、字体 68KB（gzip）。
- CI：lint、format、类型检查、覆盖率、构建、文档、内容、对比度、产物集成校验、体积预算、E2E、a11y、Lighthouse。
- 部署：GitHub Pages 工作流；Cloudflare Pages 配置写入文档。
- 文档：17 篇工程文档 + 12 篇 ADR（arc42、C4、需求追溯、测试策略、部署 runbook、安全与许可）。
- 社区：CONTRIBUTING、CODE_OF_CONDUCT、SECURITY、CITATION.cff、PR/Issue 模板、Dependabot。

### Fixed

- 项目库筛选栏由 hidden 改为首屏前由 `.js` 控制，消除 CLS 0.27 的布局偏移。
- 项目库卡片标题按页面层级渲染为 h2，消除 h1→h3 跳级。
- 视图过渡重置 `<html>` 运行态属性导致主题与移动端菜单失效的问题（`astro:after-swap`）。
- WebKit 点击按钮不聚焦导致 Esc 无法关闭菜单的问题（document 级监听）。
- 子路径部署下 canonical、sitemap、RSS、OG 地址统一走 `BASE_PATH`。

### Security

- 默认零第三方脚本、无 Cookie、无跟踪；分析默认关闭。
- 内容发布前运行隐私检查，拦截手机号与敏感字段。
- 依赖锁文件 + Dependabot + 安全披露流程。

## [0.1.0] - 2026-10-23

### Added

- 初始化 Git 仓库与目录结构。
- README、MIT LICENSE、文档索引与校验脚本。
- 技术调研（8 个候选方案）与 12 篇 ADR。
