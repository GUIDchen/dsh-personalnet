---
adr: 0008
标题: 测试栈：Vitest + Playwright + axe + Lighthouse CI
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0008：测试栈：Vitest + Playwright + axe + Lighthouse CI

## 状态

Accepted（2026-10-23）

## 背景

单人维护需要自动化门禁覆盖单元逻辑、构建产物、真实浏览器行为、可访问性与性能。

## 决策驱动因素

- 覆盖率可量化
- 真实浏览器验证
- 性能回归阻断
- CI 时间可控

## 考虑过的选项

- **Vitest 5 + Playwright 1.64 + axe-core + LHCI**：覆盖完整，生态成熟
- **Jest + Cypress**：成熟但更慢、配置更重
- **仅单元测试**：无法验证体验与性能
- **仅 e2e**：慢且定位困难

## 决策

采用 Vitest（单元/组件）、Playwright（e2e/axe）、Lighthouse CI（性能预算）；构建产物断言作为集成层。

## 后果

### 正面

- 分层清晰，失败定位快
- 与 Vite 8 兼容

### 负面

- LHCI 在 CI 中有抖动，需要取中位数
- Playwright 首次安装浏览器耗时

### 后续行动

- LHCI 运行 3 次取中位数；浏览器缓存到 CI；e2e 只覆盖关键路径。

## 相关

- [10-testing-strategy.md](../10-testing-strategy.md)
