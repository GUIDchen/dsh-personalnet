---
文档编号: 10
标题: 测试策略
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 测试策略

## 1. 测试金字塔

```
        ┌──────────────┐
        │  E2E / a11y  │  Playwright + axe（关键路径）
        ├──────────────┤
        │  集成（产物） │  构建后断言 dist
        ├──────────────┤
        │ 组件（容器）  │  AstroContainer
        ├──────────────┤
        │  单元（纯函数）│  Vitest
        └──────────────┘
```

比例目标：单元 ≥60%、组件/集成 ≥25%、E2E ≤15%（数量），覆盖率以 `src/lib` 为准。

## 2. 工具与职责

| 层 | 工具 | 负责 |
|---|---|---|
| 单元 | Vitest 5 | 筛选、排序、facet、slug、日期、SEO、JSON-LD |
| 组件 | Vitest + `experimental_AstroContainer` | 组件渲染与 a11y 属性 |
| 集成 | Node 脚本 + Vitest | 构建产物文件、JSON、sitemap、RSS、OG |
| E2E | Playwright 1.64 | 真实浏览器交互、响应式、无 JS |
| 可访问性 | @axe-core/playwright 4.14 | 自动扫描 + 键盘走查 |
| 性能 | Lighthouse CI 0.15 | 预算与分数 |
| 内容 | 自定义脚本 | frontmatter、长度、alt、标签词表、隐私 |

## 3. 测试清单

### 3.1 单元测试

| 用例 | 断言 |
|---|---|
| `filterProjects` 按领域 | 只返回匹配项 |
| `filterProjects` 领域 + 标签 | 交集语义 |
| `sortProjects` 三种模式 | 顺序稳定，同权重按标题 |
| `getProjectFacets` | 计数与实际项目一致 |
| `buildSeoMeta` | title/description/canonical 组合正确 |
| `buildProjectJsonLd` | 必填字段与类型 |
| `formatDate` | `YYYY.MM` 与中文展示 |
| schema 负例 | 缺 alt、非法 domain、summary 超长均抛错 |

### 3.2 组件测试

| 组件 | 断言 |
|---|---|
| ProjectCard | 标题、领域、标签、链接；封面缺失时占位；alt 透传 |
| Badge/Tag | class 与文本；无 a11y 违规 |
| Toc | 锚点与层级 |
| Breadcrumbs | 最后一项 `aria-current` |
| EmptyState | 文案与清除按钮 |

### 3.3 集成测试（基于 dist）

| 断言 | 期望 |
|---|---|
| 项目详情页数量 | = 已发布项目数 |
| 每页 title/canonical | 唯一且非空 |
| `sitemap-index.xml` | 包含全部页面，排除草稿 |
| `rss.xml` | XML 合法，条目 ≥1 |
| `projects.json` | 结构合法，count 一致 |
| `pagefind/` | 索引文件存在 |
| `og/<slug>.png` | 每个项目存在 |
| `404.html` | 存在且含返回链接 |
| 内部链接 | 无 404（扫描 dist） |

### 3.4 E2E 场景

| # | 场景 |
|---|---|
| 1 | 首页加载，H1 与精选项目可见 |
| 2 | 主导航跳转，当前页有 `aria-current` |
| 3 | 移动端菜单打开/关闭，Esc 生效 |
| 4 | 主题切换到暗色，刷新后保持 |
| 5 | 项目库按领域筛选，URL 变化，刷新还原 |
| 6 | 标签多选与清除，计数正确 |
| 7 | 排序切换，顺序正确 |
| 8 | ⌘K 唤起搜索，输入命中，Esc 关闭 |
| 9 | 搜索无结果状态 |
| 10 | 详情页 TOC 点击跳转，滚动定位准确 |
| 11 | 简历页打印按钮与打印媒体样式 |
| 12 | 禁用 JS 后内容仍可见 |
| 13 | 404 页面与返回链接 |
| 14 | 过渡导航后焦点不丢失 |
| 15 | 笔记列表展示全部已发布笔记 |
| 16 | 笔记详情 TOC 与 BlogPosting 结构化数据 |
| 17 | 搜索命中笔记 |
| 18 | RSS 同时包含项目与笔记 |
| 19 | 详情页封面包含 LQIP 内联样式 |

### 3.5 可访问性

- 24 个关键页面 axe 扫描（中文 14 页 + 英文 9 页 + 后台仪表盘，0 serious/critical）；E2E 86 项；LHCI 13 页。
- 键盘走查用例 2/3/5/8/11。
- 200% 缩放与 320px 宽度无横向滚动。

### 3.6 性能

- LHCI 移动端 4G 节流，13 个关键页面（首页/项目库/详情/GitHub/安全/订阅/关于/简历/笔记/Now/Uses/英文首页/英文项目库）各跑 1 次；抖动时重跑。
- 预算失败即阻断合并。

## 4. CI 阶段

```
lint → typecheck → unit → build → integration → e2e → a11y → perf → deploy（仅 main）
```

| 阶段 | 命令 | 超时 |
|---|---|---|
| lint | `pnpm lint` | 3min |
| typecheck | `pnpm check` | 5min |
| unit | `pnpm test:unit --coverage` | 5min |
| build | `pnpm build` | 8min |
| integration | `pnpm test:integration` | 3min |
| e2e | `pnpm test:e2e` | 10min |
| a11y | `pnpm test:a11y` | 5min |
| perf | `pnpm perf` | 10min |

## 5. 覆盖率与质量门槛

- `src/lib` 行覆盖 ≥80%，分支 ≥70%。
- 新增 lib 函数必须带测试。
- 不允许跳过测试（`test.skip`）进入 main。

## 6. 稳定性

- E2E 使用 `data-testid`，不依赖样式类名。
- 网络等待用条件断言，不用固定 sleep。
- LHCI 抖动：3 次取中位数，允许 ±2 分容差。
- 失败重试仅限 E2E 基础设施错误（1 次），业务断言不重试。

## 7. 测试数据

- `tests/fixtures/` 存放最小项目样本（合法、非法各一组）。
- 不在测试中读取真实内容，避免内容变更导致测试失败。
- 构建产物测试使用真实内容，但只断言结构与数量关系。