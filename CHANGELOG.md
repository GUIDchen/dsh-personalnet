# Changelog

本项目的所有重要变更记录在此文件。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

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