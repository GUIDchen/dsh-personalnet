# 文档索引

本目录是 `dsh-personalnet` 的软件工程文档全集。文档按"决策 → 需求 → 架构 → 实现规范 → 质量 → 运维"排列，编号稳定，新增文档只追加编号。

## 元信息

| 项 | 值 |
|---|---|
| 项目 | dsh-personalnet（个人网站） |
| 文档负责人 | 陈陇刚 |
| 状态 | Approved（M0 基线） |
| 最后更新 | 2026-10-23 |
| 文档语言 | 简体中文（术语首现保留英文） |

## 阅读路径

- **快速了解**：`README.md`（根目录）→ `01-vision-and-scope.md` → `04-technology-comparison.md`
- **参与开发**：`02-requirements.md` → `05-architecture.md` → `08-content-model.md` → `10-testing-strategy.md`
- **设计与内容**：`06-design-system.md` → `07-information-architecture.md` → `15-writing-style.md`
- **发布与运维**：`11-deployment-operations.md` → `12-security-privacy-licensing.md` → `13-roadmap-and-backlog.md`

## 文档清单

| 编号 | 文件 | 内容 | 状态 |
|---|---|---|---|
| 00 | [00-glossary.md](./00-glossary.md) | 术语表 | Approved |
| 01 | [01-vision-and-scope.md](./01-vision-and-scope.md) | 愿景、范围、KPI | Approved |
| 02 | [02-requirements.md](./02-requirements.md) | 用户故事、功能/非功能需求、追溯矩阵 | Approved |
| 03 | [03-research-landscape.md](./03-research-landscape.md) | 技术方案调研（前端、后端、周边） | Approved |
| 04 | [04-technology-comparison.md](./04-technology-comparison.md) | 加权对比、敏感性分析、结论 | Approved |
| 05 | [05-architecture.md](./05-architecture.md) | arc42 架构与 C4 视图 | Approved |
| 06 | [06-design-system.md](./06-design-system.md) | 视觉语言与设计令牌 | Approved |
| 07 | [07-information-architecture.md](./07-information-architecture.md) | 站点地图、页面规格 | Approved |
| 08 | [08-content-model.md](./08-content-model.md) | 内容 schema 与写作规范 | Approved |
| 09 | [09-seo-performance-a11y.md](./09-seo-performance-a11y.md) | SEO、性能预算、可访问性 | Approved |
| 10 | [10-testing-strategy.md](./10-testing-strategy.md) | 测试策略与 CI 门禁 | Approved |
| 11 | [11-deployment-operations.md](./11-deployment-operations.md) | 部署、运维、回滚 | Draft |
| 12 | [12-security-privacy-licensing.md](./12-security-privacy-licensing.md) | 安全、隐私、许可 | Draft |
| 13 | [13-roadmap-and-backlog.md](./13-roadmap-and-backlog.md) | 路线图与 Backlog | Draft |
| 14 | [14-content-migration.md](./14-content-migration.md) | 简历到站点的内容迁移 | Draft |
| 15 | [15-writing-style.md](./15-writing-style.md) | 中文写作与图表规范 | Draft |
| 16 | [16-component-catalog.md](./16-component-catalog.md) | 组件目录与契约 | Approved |
| ADR | [adr/](./adr/) | 12 篇架构决策记录 | Approved |

## 文档规则

1. 每篇文档头部包含：编号、标题、状态、最后更新、维护者。
2. 状态取值：`Draft`（写作中）、`Review`（待评）、`Approved`（已生效）、`Deprecated`（已废弃，保留链接）。
3. 涉及决策的文档必须链接到对应 ADR；ADR 一旦批准不修改结论，只追加"后续变更"。
4. 图表优先使用 Mermaid（GitHub 原生渲染），必要时附 ASCII 线框。
5. 文档变更与代码变更同一次提交或紧邻提交，并在 `CHANGELOG.md` 记录。

## 变更记录

| 日期 | 版本 | 说明 |
|---|---|---|
| 2026-10-23 | 0.1.0 | 建立 M0 文档基线：00–05、12 篇 ADR |