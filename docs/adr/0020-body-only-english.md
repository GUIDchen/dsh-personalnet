---
adr: 0020
标题: 英文正文采用 body-only 集合，元数据保留在中文条目
状态: Accepted
日期: 2026-10-24
决策者: 陈陇刚
---

# ADR 0020：英文正文采用 body-only 集合

## 背景

项目/笔记已有 titleEn/summaryEn，但正文仍中文。若为英文复制整套 MDX，会重复 frontmatter、封面、链接与指标，产生漂移。

## 决策

- 中文条目继续作为唯一元数据源。
- 新增 src/content/projects-en、src/content/notes-en，仅 title/draft + 英文正文。
- 英文侧栏字段（roleEn/teamEn/highlightsEn/metricsEn/takeawaysEn）保留在中文条目。
- /en/projects/<slug>/、/en/notes/<slug>/ 读取对应 body；缺失时构建检查失败。
- hreflang 双向，语言切换保持同一 slug。

## 后果

优点：元数据不重复、英文正文可独立编辑、缺失可检测。
代价：两条内容链路（元数据 + body）需要 check:translations；CMS 需要额外集合。
