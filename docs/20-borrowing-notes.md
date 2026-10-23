---
文档编号: 20
标题: 优秀个人网站借鉴笔记
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 优秀个人网站借鉴笔记

> 调研与实测数据见 [18-benchmark-and-gap-analysis.md](./18-benchmark-and-gap-analysis.md)。本文件只记录"借鉴什么、如何落地、不借鉴什么"。

## 1. 借鉴原则

1. 借鉴**信息结构与交互模式**，不复制视觉资产、代码或文案。
2. 优先选择低维护成本、可静态实现的模式；不引入重型 3D、无审核的社区功能。
3. 任何新增页面都必须有明确的内容来源，避免为模板而模板。

## 2. 借鉴清单

| 来源 | 观察到的做法 | 本站落地方式 | 阶段 |
|---|---|---|---|
| [rauno.me](https://rauno.me) | 首屏一句强主张 + 单一高识别视觉符号 | Hero 改为具体主张；用编号/领域色形成统一母题，不新增 3D | M9 |
| [paco.me](https://paco.me) | 文本优先、三栏索引、⌘K 提示 | 首页降密度；⌘K 升级为命令面板（导航/主题/复制邮箱/RSS） | M9 |
| [shud.in](https://shud.in) | thoughts / projects / guestbook 一等入口 | 保留笔记；新增 /now、/uses；guestbook 需审核与后端，暂不做 | M9 |
| [jhey.dev](https://jhey.dev) | 手绘签名、状态小组件、实验清单 | 可用状态 + 本地时间；实验索引列入 P2 Backlog | M9/P2 |
| [leerob.io](https://leerob.io) | 长短 bio 切换、插画、Notes/Blogs 分栏 | Hero 增加 short/long bio；内容分栏维持现状 | M9 |
| [brittanychiang.com](https://brittanychiang.com) | 作品集视觉与项目呈现 | Figure/Gallery 组件与证据清单；真实图片由作者提供 | M9 |
| [emilkowal.ski](https://emilkowal.ski) | 大留白、两段式信息 | 首页移除重复技能/经历，下沉到关于页 | M9 |
| [AstroPaper](https://astro-paper.pages.dev) | Astro 博客模板的结构 | 仅参考内容组织，不复制主题代码 | — |
| [Magic Portfolio](https://demo.magic-portfolio.com) | 视觉化作品集模板 | 仅参考作品呈现，许可非标准，不复用 | — |

## 3. 不借鉴

| 做法 | 原因 |
|---|---|
| 全屏 3D / WebGL 首屏 | 与当前零 JS 默认和性能预算冲突，收益不确定 |
| 无审核的 Guestbook / 评论 | 需要后端、反垃圾与隐私管理，维护成本高 |
| 复制第三方插画/字体/代码 | 版权与许可风险；本站已有自托管字体与生成式封面 |
| 用第三方模板替换现有设计系统 | 会丢失已有的设计令牌、可访问性与测试基线 |

## 4. 与本站差异的定位

- 优秀站点多为"个性驱动 + 少量精选"；本站是"系统驱动 + 多领域广度"。
- 因此不追求同款视觉，而是补足"人"的部分：主张、状态、证据、写作与后台。
- 技术栈不是差距：Astro 已被 jhey.dev 与 AstroPaper 验证；本站的静态输出与预算控制是优势。
