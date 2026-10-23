---
文档编号: 16
标题: 组件目录
状态: Draft
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 组件目录

组件分四类：`ui/`（原子）、`layout/`（骨架）、`project/`（业务）、`seo/`（元数据）。所有组件为 `.astro`，交互通过 `data-*` 钩子与原生 TS 脚本增强。

## 1. ui/

| 组件 | Props | 状态 | 可访问性 |
|---|---|---|---|
| Button | `variant: primary\|secondary\|ghost`、`href?`、`size` | default/hover/focus/active/disabled | 渲染 `<a>` 或 `<button>`；焦点环；`aria-disabled` |
| IconButton | `label`（必填）、`icon` | 同上 | 必须有 `aria-label`；触控 ≥44px |
| Badge | `tone: accent\|neutral\|success\|warning` | — | 文本对比达标；不单独用颜色表意 |
| Tag | `label`、`href?` | hover/focus | 可点击时为链接 |
| Card | `as?: article\|li` | hover | 语义标签；不嵌套交互元素 |
| Divider | `label?` | — | 装饰用 `role="presentation"` |
| EmptyState | `title`、`description`、`action?` | — | 标题层级 h2/h3；行动按钮可聚焦 |

## 2. layout/

| 组件 | Props | 说明 |
|---|---|---|
| BaseLayout | `title`、`description`、`image?`、`noindex?` | `<html lang>`、head、主题脚本、跳过链接 |
| PageLayout | `title`、`eyebrow?`、`lead?` | 内容页统一间距与标题区 |
| ProjectLayout | `project`、`headings` | 详情页两栏 + TOC + 相关项目 |
| Header | `currentPath` | logo、导航、搜索入口、主题切换 |
| Nav | `items` | `aria-current="page"` |
| MobileMenu | — | 原生 popover；Esc 关闭；焦点返回 |
| ThemeToggle | — | `aria-pressed`；三态循环 |
| Footer | — | 链接、许可、RSS、返回顶部 |
| SkipLink | — | 首个可聚焦，指向 `#main` |

## 3. project/

| 组件 | Props | 说明 |
|---|---|---|
| ProjectCard | `project`、`variant: default\|compact` | 封面（可占位）、标题、摘要、领域、标签、年份 |
| ProjectGrid | `projects` | 响应式 3/2/1 列；`<ul>` 语义 |
| FilterBar | `facets`、`active` | 领域 chips + 标签多选；`aria-pressed`；无 JS 退化为锚点 |
| SortSelect | `value` | 原生 `<select>` + label |
| ResultCount | `count` | `aria-live="polite"` |
| Toc | `headings` | 嵌套列表；当前项高亮（IntersectionObserver） |
| Metric | `label`、`value`、`unit?` | 数值强调，单位弱化 |
| Timeline | `items` | 教育/经历；`<ol>` |
| Gallery | `images` | 网格；点击打开 `<dialog>` 灯箱 |
| Lightbox | — | 原生 dialog；Esc 关闭；焦点返回；箭头切换 |
| Breadcrumbs | `items` | 最后一项 `aria-current="page"` |
| RelatedProjects | `projects` | 同领域最多 3 个 |
| PrevNext | `prev?`、`next?` | 上下篇链接 |

## 4. seo/

| 组件 | Props | 说明 |
|---|---|---|
| Meta | `seo` | title/description/canonical/OG/Twitter |
| JsonLd | `data` | `<script type="application/ld+json">`，序列化防注入 |

## 5. mdx/

| 组件 | 用途 | 约束 |
|---|---|---|
| Callout | 提示/警告 | `type: info\|warn\|success` |
| Figure | 带题注图片 | 强制 `alt` 与 `caption` |
| CodeBlock | 代码块包装 | 由 Astro 默认高亮，不引入客户端库 |
| StatGrid | 指标网格 | 最多 4 项 |

## 6. 交互钩子约定

| 钩子 | 作用 |
|---|---|
| `data-filter-root` | 筛选容器根节点 |
| `data-filter-chip` + `data-domain` | 领域 chip |
| `data-filter-tag` + `data-tag` | 标签 chip |
| `data-project-item` + `data-domain`/`data-tags` | 可筛选卡片 |
| `data-result-count` | 结果计数节点 |
| `data-sort` | 排序控件 |
| `data-search-open` | 打开搜索 |
| `data-theme-toggle` | 主题切换 |
| `data-lightbox` | 打开灯箱的图片链接 |

## 7. 组件规则

1. 组件不读文件系统，不直接调用 `getCollection`（页面负责数据）。
2. 所有交互元素必须是原生可聚焦元素。
3. 不在组件内写死中文文案（通过 `t()` 或 props）。
4. 新增组件需在本目录登记 props 与 a11y 要求，并补组件测试。