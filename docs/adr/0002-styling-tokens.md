---
adr: 0002
标题: Tailwind CSS 4 + OKLCH 设计令牌
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0002：Tailwind CSS 4 + OKLCH 设计令牌

## 状态

Accepted（2026-10-23）

## 背景

需要一套可长期演进的设计系统，支持深浅主题、可访问对比度与快速迭代；同时控制 CSS 体积。

## 决策驱动因素

- CSS 体积 ≤30KB gzip
- 设计与实现共享同一套令牌
- 与 Vite 8 / Astro 7 集成
- 颜色需可预测地做对比度校验

## 考虑过的选项

- **Tailwind CSS 4（CSS-first @theme）+ 自定义令牌**：构建快、无运行时、令牌即 CSS 变量
- **shadcn/ui + Radix**：组件成熟，但为 React 生态，会引入框架运行时
- **UnoCSS**：灵活但生态与文档弱
- **Panda CSS**：类型安全好，但学习成本与社区规模不匹配
- **手写 CSS Modules**：完全可控，但开发效率低、设计一致性难保证

## 决策

采用 Tailwind CSS 4，通过 `src/styles/tokens.css` 定义 OKLCH 颜色、字体、间距、动效令牌；组件用 Astro + 原生 TS 实现。

## 后果

### 正面

- 令牌单一来源，主题切换只改变量
- OKLCH 便于生成一致的明度阶梯
- 无运行时 CSS-in-JS 开销

### 负面

- Tailwind 4 要求现代浏览器（与目标一致）
- 需要纪律避免任意值滥用

### 后续行动

- 提交前运行 prettier-plugin-tailwindcss 排序；新增令牌需在设计系统文档登记。

## 相关

- [06-design-system.md](../06-design-system.md)
- [16-component-catalog.md](../16-component-catalog.md)
