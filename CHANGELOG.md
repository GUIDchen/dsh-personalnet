# Changelog

本项目的所有重要变更记录在此文件。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- 搜索：Pagefind 构建期索引（17 页）+ /search/ 自定义界面，⌘K / Ctrl+K 全局唤起，支持无结果态。
- 视图过渡：ClientRouter，主题/菜单/筛选脚本在导航后重新初始化，Esc 与焦点行为有回归测试。
- OG 图：13 张 1200×630 社交分享图；项目封面 1600×1000 经 astro:assets 输出 AVIF/WebP/JPG 响应式图片。
- 内容：12 个项目案例覆盖 7 个领域，标签词表 34 项；内容校验脚本检查字段、长度、标签、隐私。
- 项目库支持领域/标签筛选、三种排序、URL 状态同步与无 JavaScript 降级。
- 项目详情新增目录（TOC）与结构化数据（CreativeWork + BreadcrumbList）；首页/关于注入 Person 与 WebSite。
- 新增 /rss.xml 与 /projects.json 机器可读输出。
- 单元测试 17 项、E2E 9 项（WebKit）覆盖筛选、排序、TOC、供稿与主题/菜单。
- 设计系统：OKLCH 令牌、双主题（跟随系统 + 手动切换）、自托管 Geist / JetBrains Mono 拉丁子集。
- 站点骨架：Header / 导航 / 主题切换 / Footer / 按钮 / 徽标 / 章节标题 / 项目卡片。
- 首页、项目库、项目详情、关于、404 的视觉实现与响应式布局（390–1920px）。
- Astro 7 + TypeScript 6 + Tailwind CSS 4 工程脚手架，静态构建通过。
- 内容集合 schema（Zod）与首个 MDX 案例，构建期校验生效。
- 基础页面：首页、项目库、项目详情、关于、404。
- 设计令牌与对比度校验脚本（`check:contrast`）。
- ESLint 10 / Prettier 3 / Vitest 5 / Playwright 配置与单元测试。
- GitHub Actions CI（lint、format、check、test、build、docs、contrast）。

- M0 文档基线：docs/00–16 共 17 篇工程文档。
- 12 篇架构决策记录（ADR 0001–0012）。
- 技术调研与加权对比（8 个候选方案、敏感性分析、TCO）。

## [0.1.0] - 2026-10-23

### Added

- 初始化 Git 仓库与目录结构。
- README、MIT LICENSE、文档索引与校验脚本。