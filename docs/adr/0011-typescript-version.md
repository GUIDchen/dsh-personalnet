---
adr: 0011
标题: 锁定 TypeScript 6.0.3，暂缓 TypeScript 7
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0011：锁定 TypeScript 6.0.3，暂缓 TypeScript 7

## 状态

Accepted（2026-10-23）

## 背景

TypeScript 7.0.2 已是 npm latest（原生编译器），但类型检查工具链尚未跟进。

## 决策驱动因素

- `astro check` 必须可用
- `typescript-eslint` 必须可用
- 升级可回滚

## 考虑过的选项

- **TypeScript 6.0.3**：被 `@astrojs/check@0.9.12`（^5||^6）与 `typescript-eslint@8.72`（<6.1.0）支持
- **TypeScript 7.0.2**：最新，但 peer 范围不覆盖，类型检查与 lint 会失败
- **保持 5.9.3**：稳定，但落后一个大版本

## 决策

锁定 `typescript@6.0.3`，在 `package.json` 中精确版本；升级 TS 7 需等待 `@astrojs/check` 与 typescript-eslint 发布兼容版本。

## 后果

### 正面

- 工具链全部可用
- 避免隐式破坏

### 负面

- 暂时用不到 TS 7 的性能提升

### 后续行动

- 每月检查两个 peer 范围；满足后单独提交升级 PR 并跑全量测试。

## 相关

- [03-research-landscape.md](../03-research-landscape.md)
- [10-testing-strategy.md](../10-testing-strategy.md)
