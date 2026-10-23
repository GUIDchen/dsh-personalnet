---
adr: 0005
标题: Pagefind 作为静态全文搜索
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0005：Pagefind 作为静态全文搜索

## 状态

Accepted（2026-10-23）

## 背景

项目与案例正文需要可检索；静态站点不能依赖运行时服务。

## 决策驱动因素

- 零服务依赖
- 构建期建索引，运行时按需加载
- 支持中文分词
- 体积可控（搜索页 ≤60KB）

## 考虑过的选项

- **Pagefind 1.5 + astro-pagefind 2.0**：构建期索引，分片加载，MIT
- **客户端全量 JSON + Fuse.js**：实现简单，但全量加载体积大
- **Meilisearch / Typesense**：体验好，但需要服务与运维
- **Algolia DocSearch**：托管服务，有成本与数据外发

## 决策

采用 Pagefind，构建后对 dist 建索引；搜索页自定义 UI（不使用默认皮肤），支持 ⌘K 唤起与键盘导航。

## 后果

### 正面

- 无服务端成本
- 索引按需分片，首屏无影响
- 中文检索可用

### 负面

- 索引构建增加约数秒
- 子路径部署需正确设置 base

### 后续行动

- 在 `BASE_PATH=/repo/` 下专项 e2e；索引失败时搜索页显示降级提示。

## 相关

- [09-seo-performance-a11y.md](../09-seo-performance-a11y.md)
- [11-deployment-operations.md](../11-deployment-operations.md)
