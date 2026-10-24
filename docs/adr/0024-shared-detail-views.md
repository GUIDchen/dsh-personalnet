---
adr: 0024
标题: 项目/笔记详情使用共享视图组件
状态: Accepted
日期: 2026-10-24
决策者: 陈陇刚
---

# ADR 0024：详情页共享视图组件

## 背景

P1 英文详情上线后，中文与英文的项目/笔记详情各有一份页面代码。布局、CSS、JSON-LD、面包屑、相关项目逻辑重复，修改样式或可访问性需要同步两处，容易漂移。

## 决策

- 新增 src/components/project/ProjectDetail.astro 与 src/components/note/NoteDetail.astro。
- 组件接收 project/note、已渲染 Content、headings、lang、阅读时间；内部负责布局、标签、hreflang、相关项与 JSON-LD。
- 中文与英文路由只做 getStaticPaths、取数、render 和传参。
- 英文正文仍来自 body-only 集合；中文正文来自原条目。
- 共享视图的标签用 lang 字典，详情 slug 保持一致。

## 后果

### 正面

- 一份布局/样式/可访问性实现，减少中英文漂移。
- 路由文件从数百行降到约 20 行。
- 后续加第三种语言或改 TOC 结构只需改一个组件。

### 负面

- 组件需要同时理解 zh/en 文案，props 边界更宽。
- 英文 SEO 长标题仍需少量特判（登记为 TD-03）。
- 组件内使用 any 接收 Astro Content 类型；由构建和 E2E 兜底。
