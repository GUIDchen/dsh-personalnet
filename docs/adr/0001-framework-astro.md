---
adr: 0001
标题: 采用 Astro 7 作为站点框架
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0001：采用 Astro 7 作为站点框架

## 状态

Accepted（2026-10-23）

## 背景

个人网站需要展示 7 个领域的项目案例，页面以内容为主、交互为辅；同时要求移动端性能优秀、可静态部署、可开源、长期可维护。

## 决策驱动因素

- 默认零客户端 JS，满足 LCP ≤1.8s 与首页 JS ≤25KB
- 类型安全的内容集合（Content Layer + Zod）
- 设计自由度与组件化能力
- 纯静态产物，可部署到任意静态托管
- 生态活跃、升级路径清晰

## 考虑过的选项

- **Astro 7**：静态优先、islands、内容集合；Sätteri 迁移期需规避 remark 插件
- **Next.js 16**：生态最大，但 RSC 概念与默认 JS 体积超出需求
- **Nuxt 4**：内容能力强，但默认 hydration 成本高，SSR 能力用不上
- **SvelteKit 3**：运行时小，但内容层与模板生态弱
- **Hugo / Eleventy**：构建快，但组件化与类型安全不足

## 决策

采用 Astro 7（静态输出），交互以原生 TS island 实现，不引入 UI 框架运行时。

## 后果

### 正面

- 首屏默认无 JS，性能目标天然可达
- 内容 schema 与页面类型共享，重构安全
- 产物纯静态，零运维与零成本托管

### 负面

- Sätteri 新管线，部分 remark 插件不可用（已主动规避）
- 仍处于 7.x 早期，需锁定版本并跟踪升级

### 后续行动

- 锁定 Astro 7.4.x 与相关集成版本；不引入 remark/rehype 插件；升级前阅读 v7+ 升级指南并跑全量测试。

## 相关

- [04-technology-comparison.md](../04-technology-comparison.md)
- [05-architecture.md](../05-architecture.md)
