---
文档编号: 00
标题: 术语表
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 术语表

## 术语对照

按首字母/拼音混合排序，全项目统一用法。

| 术语 | 英文 | 释义 | 本项目用法 |
|---|---|---|---|
| ADR | Architecture Decision Record | 架构决策记录，一篇只记一个决策 | `docs/adr/` 下按序号存放，MADR 4.0 模板 |
| Astro island | island architecture | 静态 HTML 中按需激活的交互区域 | 本站仅筛选、搜索、主题、灯箱使用 |
| arc42 | arc42 | 软件架构文档模板（12 章） | `05-architecture.md` 的章节骨架 |
| C4 模型 | C4 model | 上下文/容器/组件/代码四级架构视图 | 架构文档使用 L1、L2 |
| CLS | Cumulative Layout Shift | 累积布局偏移，Core Web Vital | 预算 ≤0.05 |
| Content Collection | content collection | Astro 的类型安全内容集合 | `src/content/projects` |
| CWV | Core Web Vitals | 核心网页指标：LCP、INP、CLS | 见 `09-seo-performance-a11y.md` |
| DI | Design Token | 设计令牌，颜色/间距/字体的原子变量 | `src/styles/tokens.css` |
| frontmatter | frontmatter | Markdown 文件头部的结构化元数据 | 所有项目案例必填 |
| GFM | GitHub Flavored Markdown | GitHub 风格 Markdown | Markdown 内容基线 |
| INP | Interaction to Next Paint | 交互到下一次绘制 | 预算 ≤200ms |
| LCP | Largest Contentful Paint | 最大内容绘制 | 预算 ≤1.8s（实验室） |
| MDX | MDX | Markdown + JSX 组件 | 项目案例可嵌入 Astro 组件 |
| MoSCoW | Must/Should/Could/Won't | 需求优先级方法 | 见 `02-requirements.md` |
| NFR | Non-Functional Requirement | 非功能需求 | 性能、安全、可维护性等 |
| OKLCH | OKLCH | 感知均匀的颜色空间 | 设计令牌的颜色表示 |
| pnpm | pnpm | 快速、节省磁盘的包管理器 | 唯一包管理器，锁文件入库 |
| Sätteri | Sätteri | Astro 7 默认 Markdown 渲染管线 | 不使用 remark/rehype 插件 |
| SSG | Static Site Generation | 静态站点生成 | 本站唯一渲染模式 |
| SSRF | Server-Side Request Forgery | 服务端请求伪造 | 静态站无服务端，风险不适用 |
| token | token | 见 DI | 优先用令牌，不写魔法值 |
| WCAG 2.2 AA | Web Content Accessibility Guidelines | 无障碍标准 | 目标等级 AA |
| 领域 | domain | 项目的一级分类 | 7 个固定枚举，可扩展 |
| 案例研究 | case study | 项目详情的六段式长文 | 见 `08-content-model.md` |