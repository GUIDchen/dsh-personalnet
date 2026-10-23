---
文档编号: 09
标题: SEO、性能与可访问性
状态: Draft
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
| 速度 | 移动端 LCP ≤1.8s、CLS ≤0.05、TBT ≤150ms |
| 无障碍 | WCAG 2.2 AA |

## 2. 页面元数据

每页由 `buildSeoMeta()` 生成：

| 标签 | 规则 |
|---|---|
| `<title>` | `页面标题 · 站点名`；首页 `姓名 — 定位` |
| `description` | 项目用 `summary`；其他页面手写 ≤160 字 |
| `canonical` | `SITE_URL + BASE_PATH + path`，不含查询参数 |
| `og:title/description/image/type` | 与页面一致；项目图用 `/og/<slug>.png` |
| `twitter:card` | `summary_large_image` |
| `<html lang>` | `zh-CN` |
| `robots` | 草稿与预览环境 `noindex` |

## 3. 结构化数据（JSON-LD）

- 全站：`Person`（姓名、职位、邮箱、社交链接）、`WebSite`。
- 项目详情：`CreativeWork`（名称、摘要、作者、日期、关键词、URL）+ `BreadcrumbList`。
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
| `/rss.xml` | 最近 20 个项目/笔记，含绝对链接 |
| `/projects.json` | 机器可读作品集（非 SEO 用途，供集成方消费） |
| `404.html` | 自定义 404，返回正确状态码 |

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

- CI：LHCI 3 次取中位数，预算写在 `lighthouserc.json`。
- 本地：`pnpm build && pnpm preview` 后用 DevTools Performance 记录。
- 归档：LHCI 报告作为 CI artifact 保留 30 天。
- 回归判定：任一指标超出预算即失败；性能分数下降 >3 分需说明原因。