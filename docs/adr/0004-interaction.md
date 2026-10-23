---
adr: 0004
标题: 零框架 island 与原生 TS 交互
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0004：零框架 island 与原生 TS 交互

## 状态

Accepted（2026-10-23）

## 背景

站点只需要筛选、排序、搜索、主题、灯箱等少量交互；引入 React/Vue 会显著增加 JS 预算与维护面。

## 决策驱动因素

- 首页 JS ≤25KB gzip
- 交互必须可访问、可测试
- 长期维护成本低

## 考虑过的选项

- **原生 TypeScript + 平台 API（popover、dialog、URLSearchParams）**：体积最小，语义化好
- **React 19 islands + shadcn/ui**：组件丰富，但增加 ~40KB+ 运行时
- **Vue islands**：同样增加运行时
- **Alpine.js / htmx**：小，但增加新范式与依赖

## 决策

交互全部用原生 TS 实现，按页面/组件拆分脚本，使用 `data-*` 钩子；跨页过渡使用 Astro `<ClientRouter />`；复杂 UI 使用原生 `<dialog>` 与 popover API。

## 后果

### 正面

- JS 预算可控，首屏几乎零 JS
- 无框架升级负担
- 语义化与可访问性更直接

### 负面

- 复杂状态需手写，测试要求更高
- 团队若不熟原生 API，上手略慢

### 后续行动

- 为筛选与搜索补充 e2e；若未来出现复杂编辑器类交互，再评估引入 React island（ADR 修订）。

## 相关

- [05-architecture.md](../05-architecture.md)
- [07-information-architecture.md](../07-information-architecture.md)
