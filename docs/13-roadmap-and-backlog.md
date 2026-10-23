---
文档编号: 13
标题: 路线图与 Backlog
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 路线图与 Backlog

## 1. 里程碑

| 里程碑 | 目标 | 交付物 | 验收 | 状态 |
|---|---|---|---|---|
| M0 | 决策与文档基线 | docs/00–05、12 篇 ADR、README、文档索引、Git 初始化 | `pnpm test:docs` 通过 | ✅ 完成 |
| M1 | 工程脚手架与 CI | Astro 7 工程、Tailwind 4、ESLint/Prettier、Vitest/Playwright、CI | `pnpm build` 成功、CI 绿 | ✅ 完成 |
| M2 | 设计系统与骨架 | 令牌、布局、Header/Footer/主题、基础组件、首页骨架 | LH ≥95、4 断点截图 | ✅ 完成 |
| M3 | 内容与页面 | schema、12 个案例、首页/项目库/详情/关于/404/RSS | 12 页构建、JSON-LD 校验 | ✅ 完成 |
| M4 | 进阶体验 | 搜索、过渡、滚动动效、OG、图片优化 | 预算达标、搜索可用 | ✅ 完成 |
| M5 | 质量门禁 | 单测/集成/e2e/a11y/LHCI | `pnpm ci:verify` 全绿 | ✅ 完成 |
| M6 | 开源发布 | LICENSE、社区文件、CHANGELOG、v1.0.0 | 部署成功、文档 Approved | ✅ 完成 |
| M7 | 长期运营 | 维护手册、简历打印页、robots、内容脚手架、链接检查 | 维护基线交付；其余按 Backlog 推进 | ✅ 基线完成 |
| M8 | 内容与发现性（v1.2.0） | notes 集合、合并 RSS、中文 SEO 审计、封面 LQIP | E2E ≥34、SEO 审计通过、LHCI 6 页 | ✅ 完成 |
| M9 | 审阅与借鉴（v1.3.0） | 完成度审计、Hero 重构、/now、/uses、命令面板、证据组件 | 新页面/交互 E2E 通过 | ✅ 完成 |
| M10 | 中英文界面（v1.4.0） | i18n 字典/路由、8 个英文页面、语言切换、hreflang、英文资料 | E2E/axe/LHCI/SEO 通过 | ✅ 完成 |
| M11 | 管理后台（v1.5.0） | Sveltia CMS、内容模型映射、noindex/robots、校验脚本 | check:admin + E2E + 手工本地编辑 | ✅ 完成 |
| M12 | 自动化长跑（v1.6.0） | 健康报告、每周 maintenance workflow、Agent 契约与日志 | health + workflow 解析 + 日志 | ✅ 完成 |
| M13 | 上线发布（v2.0.0） | GitHub Pages、远程建仓、最终回归、tag | 公网 URL + LHCI/axe/SEO | ⏳ 等待远程仓库 |

## 2. Backlog

### P0（发布前必须）

| # | 项 | 验收 |
|---|---|---|
| 1 | 12 个项目内容与封面 | 字段完整、无隐私、构建通过 |
| 2 | 项目筛选与 URL 状态 | e2e 通过 |
| 3 | 搜索可用 | 索引生成、⌘K、无结果态 |
| 4 | SEO 元数据与 JSON-LD | 集成测试通过 |
| 5 | 性能预算达标 | LHCI + check-budget |
| 6 | 可访问性 0 serious | axe + 键盘 |
| 7 | 隐私检查 | `check-privacy` 通过 |

### P1（发布后 1–2 个月）

| # | 项 | 说明 |
|---|---|---|
| 8 | 项目 OG 图 | 每项目独立卡片 |
| 9 | 外部链接定时检查 | 每周 Actions |
| 10 | 打印样式（`/cv`） | 从关于页导出 PDF |
| 11 | 图片 LQIP 占位 | ✅ 已实现：24px WebP 内联占位 |
| 12 | 中文 SEO 检查 | ✅ 已实现：`pnpm test:seo` 审计标题/描述/唯一性 |

### P2（探索）

| # | 项 | 说明 |
|---|---|---|
| 13 | 技术笔记集合 | ✅ 已实现：`notes` collection、列表/详情、合并 RSS |
| 14 | 英文版 | i18n 路由启用 |
| 15 | Sveltia CMS | 浏览器编辑 |
| 16 | Umami 分析 | 环境变量开关 |
| 17 | 项目时间线视图 | 按年份分组 |
| 18 | 可视化图表组件 | 指标趋势 |

## 3. 技术债登记

| # | 项 | 影响 | 计划 |
|---|---|---|---|
| D1 | 仅中文正文 | 国际读者受限 | M7 评估英文 |
| D2 | 无 CMS | 非技术编辑不便 | M7 评估 Sveltia |
| D3 | OG/封面依赖 Playwright 浏览器 | 仅在 `gen:og` 时运行，CI 构建不触发 | 需要时在 CI 安装浏览器；或改用 satori |
| D4 | 封面为程序化生成 | 非真实项目截图 | 有真实截图后替换 `src/assets/covers/` 并重跑 `gen:og` |
| D5 | e2e 覆盖关键路径 | 边界场景靠单测 | 渐进补充 |

## 4. 风险跟踪

见 `05-architecture.md` §11 与 `04-technology-comparison.md`；每月复查一次。

## 5. 发布节奏

- 内容更新：随时（PR）。
- 依赖升级：每月第一个周末。
- 大版本：M6 v1.0.0；此后按 SemVer，破坏性变更升主版本。
- 变更记录：`CHANGELOG.md`。