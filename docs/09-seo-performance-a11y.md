---
文档编号: 09
标题: SEO、性能与可访问性
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# SEO、性能与可访问性

## 1. 目标

| 维度 | 目标 |
|---|---|
| 可抓取 | 全部页面静态 HTML，无 JS 依赖 |
| 可理解 | 唯一 title/description、语义化标题层级、结构化数据 |
| 可分享 | OG/Twitter 卡片，项目级 OG 图 |
| 速度 | 目标：移动端 LCP ≤1.8s、CLS ≤0.05、TBT ≤150ms；CI 共享 runner 使用 LCP ≤2.5s、TBT ≤600ms、性能 ≥0.90 的缓冲门禁 |
| 无障碍 | WCAG 2.2 AA |

## 2. 页面元数据

每页由 `src/components/seo/Meta.astro` 生成：

| 标签 | 规则 |
|---|---|
| `<title>` | `页面标题 · 站点名`；标题已包含站点名则不重复追加；首页为 `姓名 — 定位` |
| `description` | 项目/笔记用 `summary`；其他页面手写 20–160 字 |
| `canonical` | `SITE_URL + BASE_PATH + path`，不含查询参数 |
| `og:title/description/image/type` | 与页面一致；项目图用 `/og/<slug>.jpg`，其他页面用默认图 |
| `twitter:card` | `summary_large_image` |
| `<html lang>` | `zh-CN` |
| `robots` | 搜索页与 404 使用 `noindex` |

### 2.1 SEO 审计（`pnpm test:seo`）

`scripts/check-seo.mjs` 对构建产物逐页检查：

| 规则 | 阈值 |
|---|---|
| `lang` | `zh-CN` |
| H1 数量 | 恰好 1 个 |
| title 显示宽度 | 8–64（CJK 计 2，ASCII 计 1） |
| description | 20–160 字符 |
| title / description | 全站唯一 |
| canonical / og:image / twitter:card | 必须存在 |

noindex 页面跳过长度与唯一性规则；失败时输出页面、规则与实际值并退出 1。

## 3. 结构化数据（JSON-LD）

- 全站：`Person`（姓名、职位、邮箱、社交链接）、`WebSite`。
- 项目详情：`CreativeWork`（名称、摘要、作者、日期、关键词、URL）+ `BreadcrumbList`。
- 笔记详情：`BlogPosting`（标题、摘要、发布日期、关键词、作者、URL）+ `BreadcrumbList`。
- 验证：集成测试用 `JSON.parse` + 必填字段断言；上线后用 Schema Markup Validator 人工抽查。

示例（项目）：

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "YOLO 目标检测工程实践",
  "abstract": "从数据标注到训练调参与评估……",
  "author": { "@type": "Person", "name": "陈陇刚" },
  "dateCreated": "2023-09",
  "keywords": "yolo, opencv, dataset",
  "url": "https://example.com/projects/yolo-object-detection/"
}
```

## 4. 抓取与分发

| 文件 | 内容 |
|---|---|
| `/sitemap-index.xml` | 由 `@astrojs/sitemap` 生成，排除草稿 |
| `/robots.txt` | 允许全站，声明 sitemap 绝对地址 |
| `/rss.xml` | 最近 20 条项目与笔记（按日期倒序），含绝对链接 |
| `/projects.json` | 机器可读作品集（非 SEO 用途，供集成方消费） |
| `404.html` | 自定义 404，返回正确状态码 |

> OG 图与封面由 pnpm gen:og 生成：1200×630 社交分享图写入 public/og/，1600×1000 项目封面写入 src/assets/covers/ 并由 astro:assets 输出 AVIF/WebP/JPG。内容变更后需重新生成；check-content 会校验每个项目的 OG 文件是否存在。

## 5. 性能预算

| 资源 | 预算（gzip） | 测量 |
|---|---|---|
| 首页 JS | ≤25KB | `check-budget` |
| 详情页 JS | ≤40KB | 同上 |
| 搜索页 JS（含索引首片） | ≤60KB | 同上 |
| CSS | ≤30KB | 同上 |
| 字体 | ≤2 个 woff2，≤120KB | 同上 |
| 首页 HTML | ≤60KB | 同上 |
| LCP 图片 | ≤150KB | 构建脚本 |

### 5.1 指标预算

| 指标 | 移动端目标 |
|---|---|
| Performance 分数 | ≥95 |
| LCP | ≤1.8s |
| CLS | ≤0.05 |
| TBT | ≤150ms |
| SEO 分数 | 100 |
| A11y 分数 | 100 |

### 5.2 优化手段

1. **HTML 优先**：内容直出，JS 延后；关键 CSS 内联（Astro 默认处理）。
2. **图片**：`<Picture>` 输出 AVIF/WebP，显式宽高，首屏 `fetchpriority="high"`，其余懒加载。
3. **字体**：拉丁子集自托管，`preload` 两个文件，`font-display: swap`；中文用系统栈。
4. **JS**：按页面拆分，仅加载所需交互；搜索与灯箱按需动态 `import()`。
5. **缓存**：带 hash 的资源长缓存，HTML 短缓存。
6. **过渡**：ClientRouter 预取可见链接，减少导航等待。

## 6. 可访问性

### 6.1 目标

WCAG 2.2 AA：可感知、可操作、可理解、健壮。

### 6.2 实现要求

| 项 | 要求 |
|---|---|
| 地标 | `header/nav/main/footer` 唯一且正确嵌套 |
| 标题 | 每页唯一 h1，层级不跳级 |
| 跳过链接 | 首个可聚焦元素，指向 `#main` |
| 焦点 | 自定义 `:focus-visible` 环，永不移除；过渡后焦点回到触发元素 |
| 键盘 | 筛选、排序、搜索、灯箱、菜单全部可键盘操作 |
| 语义 | 按钮用 `<button>`，链接用 `<a>`，不用 div 模拟 |
| 表单 | label 关联、错误文本 `aria-describedby` |
| 动态 | 结果计数 `aria-live="polite"`；加载 `aria-busy` |
| 图像 | 有意义的 alt；装饰图 alt="" |
| 动效 | `prefers-reduced-motion` 全部关闭 |
| 缩放 | 200% 不横向滚动；`rem` 布局 |
| 对比度 | 见设计系统 §3.2 |
| 语言 | `lang="zh-CN"`；英文术语用 `<span lang="en">` 包裹（可选） |

### 6.3 验证

- axe（Playwright）扫描首页、项目库、详情、关于、搜索、404，0 serious/critical。
- 键盘走查：Tab 顺序、Enter/Space 激活、Esc 关闭、焦点陷阱。
- 读屏抽查：VoiceOver（macOS）读首页与一个项目详情。
- 200% 缩放与 320px 宽度截图。

## 7. 测量与回归

- CI：LHCI 对 17 个 URL 各跑 1 次，预算写在 `lighthouserc.json`；共享 runner 使用缓冲阈值（性能 ≥0.75、LCP ≤2.5s、TBT ≤1000ms、CLS ≤0.05）。
- 滚动基线：`pnpm perf:scroll` 在 Chromium 内采样 rAF 帧间隔，输出 p50/p95/max 到 reports/scroll-fps.json；本次本机结果 122 帧、p50/95 16.7ms、max 16.8ms（headless 固定 60fps，只作基线，不作为真机/Safari 结论）。
- 真机：Safari Web Inspector → Timelines → Rendering Frames；记录设备、系统、滚动路径，不伪造数据。
- 本地：`pnpm build && pnpm preview` 后用 DevTools Performance 记录；目标值仍是 LCP ≤1.8s、TBT ≤150ms。
- 归档：LHCI 报告作为 CI artifact 保留 30 天。
- 回归判定：任一指标超出预算即失败；性能分数下降 >3 分需说明原因。