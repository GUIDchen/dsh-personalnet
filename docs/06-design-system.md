---
文档编号: 06
标题: 设计系统
状态: Draft
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 设计系统

## 1. 设计原则

1. **内容是主角**：版式服务阅读，装饰不抢信息；每屏只有一个视觉焦点。
2. **克制的高级感**：单一强调色、细线分隔、大留白、精确对齐，不靠渐变堆叠。
3. **可读性优先**：正文对比度 ≥4.5:1，行宽 ≤72 字符，中文行高 1.7。
4. **动效有意义**：只用于表达层级与状态变化，全部尊重 `prefers-reduced-motion`。
5. **两套主题一套系统**：深/浅主题共用令牌，不写主题专用组件。

## 2. 视觉概念："Editorial Technical"

- 参考气质：技术刊物的排版秩序 + 产品官网的克制动效。
- 关键手法：超大标题与紧凑正文形成对比；编号（01/02/03）标注层级；等宽字体标注元信息；细网格线暗示结构。
- 避免：霓虹渐变、玻璃拟态、满屏粒子、模板化卡片阴影。

## 3. 颜色

### 3.1 种子令牌（OKLCH）

| 令牌 | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| `--bg` | `oklch(.985 .002 90)` | `oklch(.145 .005 270)` | 页面背景 |
| `--surface` | `oklch(.965 .003 90)` | `oklch(.185 .006 270)` | 卡片/浮层 |
| `--fg` | `oklch(.18 .01 270)` | `oklch(.94 .004 90)` | 主文本 |
| `--muted` | `oklch(.52 .01 270)` | `oklch(.68 .008 90)` | 次要文本/说明 |
| `--border` | `oklch(.88 .006 270)` | `oklch(.28 .008 270)` | 装饰性分隔线 |
| `--border-strong` | `oklch(.64 .008 270)` | `oklch(.50 .008 270)` | 可交互控件边界 |
| `--accent` | `oklch(.56 .19 38)` | `oklch(.80 .16 62)` | 链接/强调/焦点 |
| `--accent-fg` | `oklch(1 0 0)` | `oklch(.12 0 0)` | 强调色上的文本 |

### 3.2 对比度实测（WCAG 2.x）

| 组合 | 对比度 | 结论 |
|---|---|---|
| 亮色 `fg/bg` | 18.02:1 | AAA |
| 亮色 `muted/bg` | 5.28:1 | AA |
| 亮色 `accent/bg` | 4.86:1 | AA（正文链接可用） |
| 亮色 `accent-fg(白)/accent` | 5.07:1 | AA |
| 亮色 `border-strong/bg` | 3.22:1 | AA（非文本控件） |
| 暗色 `fg/bg` | 16.60:1 | AAA |
| 暗色 `muted/bg` | 6.87:1 | AA |
| 暗色 `accent/bg` | 9.98:1 | AAA |
| 暗色 `accent-fg/accent` | 10.23:1 | AAA |
| 暗色 `border-strong/bg` | 3.30:1 | AA（非文本控件） |

> 数值由 `scripts/check-contrast.mjs`（OKLCH → 线性 sRGB → 相对亮度）计算。修改令牌后必须重算。

### 3.3 领域点缀色

每个领域一个低饱和色，仅用于卡片左侧 2px 竖线、标签圆点与小面积背景：

| 领域 | 色相（OKLCH h） |
|---|---|
| ai-llm | 285 |
| computer-vision | 200 |
| data-analytics | 150 |
| embedded-systems | 25 |
| infrastructure | 240 |
| web-engineering | 320 |
| research | 70 |

色相固定、明度随主题取 `--accent` 同类明度，保证对比度不依赖具体值。

## 4. 排版

| 角色 | 字体 | 字号 | 行高 | 字重 |
|---|---|---|---|---|
| Display / H1 | Geist Variable | `clamp(2.25rem, 6vw, 5.5rem)` | 1.02 | 600 |
| H2 | Geist Variable | `clamp(1.5rem, 3vw, 2.25rem)` | 1.15 | 600 |
| H3 | Geist Variable | 1.25rem | 1.3 | 600 |
| Body | Geist Variable | `clamp(1rem, 1.05vw, 1.125rem)` | 1.7 | 400 |
| Small | Geist Variable | 0.875rem | 1.5 | 400 |
| Mono / Label | JetBrains Mono Variable | 0.75–0.875rem | 1.4 | 500 |
| 中文正文 | 系统栈 | 继承 | 1.75 | 400 |

字体栈：

```css
--font-sans: "Geist Variable", "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", system-ui, sans-serif;
--font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace;
```

规则：标题使用 `text-wrap: balance`，正文段落使用 `text-wrap: pretty`；英文与中文之间不手动加空格（由排版规则处理）；不使用 `text-align: justify`。

## 5. 间距与栅格

- 基准 4px；常用步进：4/8/12/16/24/32/48/64/96/128/160。
- 12 列网格，最大内容宽 1280px，gutter 24px，页面边距 `clamp(20px, 5vw, 64px)`。
- 区块垂直节奏：移动端 64–96px，桌面端 96–160px。
- 断点：`sm 640` / `md 768` / `lg 1024` / `xl 1280`。

## 6. 组件状态约定

| 状态 | 视觉要求 |
|---|---|
| default | 边框 `--border`，文本 `--fg` |
| hover | 背景 `--surface`，边框 `--border-strong`，过渡 120ms |
| focus-visible | 2px `--accent` 外环 + 2px 偏移，永不移除 |
| active | 背景明度降低 4%，位移 ≤1px |
| disabled | 透明度 0.5，`cursor: not-allowed`，保留对比度 |
| selected | 强调色背景 + `--accent-fg` 文本 |
| loading | 骨架屏（不旋转），`aria-busy="true"` |
| error | 边框 + 文本使用语义色，附图标与文字说明 |

## 7. 动效

| 令牌 | 值 |
|---|---|
| `--dur-1` | 120ms（悬停/焦点） |
| `--dur-2` | 200ms（展开/折叠） |
| `--dur-3` | 320ms（页面过渡） |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` |

- 页面过渡：`<ClientRouter />` + `view-transition-name`，过渡期间保持 header/footer 稳定。
- 滚动入场：`animation-timeline: view()`，仅在 `@supports (animation-timeline: view())` 内启用。
- 减少动效：`@media (prefers-reduced-motion: reduce)` 下所有动画时长置 0，禁用 view transition。

## 8. 主题

- 三态：`light` / `dark` / `system`；默认 `system`。
- 首屏内联脚本读取 `localStorage.theme` 并设置 `document.documentElement.dataset.theme`，避免闪烁。
- 颜色使用 `light-dark()` 或 `[data-theme="dark"]` 变量覆盖，二者不混用。
- 主题切换按钮为 `<button aria-pressed>`，带文字标签（不只图标）。

## 9. 图像与图标

- 项目封面：16:10，最小 1600×1000，输出 AVIF/WebP，单图 ≤150KB。
- 正文配图：显式宽高，`loading="lazy"`、`decoding="async"`；首屏封面 `fetchpriority="high"`。
- 图标：内联 SVG sprite，`stroke="currentColor"`，默认 `aria-hidden="true"`；独立可点击图标必须有 `aria-label`。
- 噪点：1 个 `feTurbulence` SVG，≤2KB，透明度 ≤0.04。

## 10. 可访问性清单（设计阶段）

- [ ] 所有文本组合对比度达标（见 §3.2）
- [ ] 焦点样式可见且不被裁切
- [ ] 不依赖颜色传达状态（配合图标/文字）
- [ ] 触控目标 ≥44×44px
- [ ] 200% 缩放下不横向滚动
- [ ] 表单/筛选控件有关联 label
- [ ] 动效可关闭

## 11. 参考

- Astro 官方文档的设计与可访问性实践
- WCAG 2.2 快速参考
- 《Refactoring UI》的层级与间距原则