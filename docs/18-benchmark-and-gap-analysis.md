---
文档编号: 18
标题: 优秀个人网站基准调研与差距分析
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 优秀个人网站基准调研与差距分析

> 调研日期：2026-10-23。站点可访问性、框架标记、HTML 体积与 GitHub 仓库数据为当日实测；设计判断基于 1280×900 截图（仅用于分析，未复制任何代码或素材）。

## 1. 调研方法

1. 选取 8 个公开个人站点：4 个设计/前端方向、2 个工程博客方向、2 个作品集模板。
2. 用 `curl` 检查 HTTP 状态、HTML 体积与框架标记（`__NEXT_DATA__`、`data-astro` 等）。
3. 用 Playwright（WebKit）截取首屏，观察版式、信息层级、个性表达与互动线索。
4. 用 GitHub API 核对开源仓库的 stars、许可证与最近推送时间。
5. 对照本站 v1.2.0 的实现（代码、docs、质量门禁）做差距判断。

**局限**：未对各站做 Lighthouse 或真实设备测试，因此不比较具体性能分数；对未成功截图或加载的站点只引用可验证的仓库/状态信息。

## 2. 参考站点

| # | 站点 | 定位 | 技术标记（实测） | 首屏观察 | 可借鉴 |
|---|---|---|---|---|---|
| 1 | [rauno.me](https://rauno.me) | 交互设计师 / 设计工程师 | Next.js（`__NEXT_DATA__`），HTML ≈31KB | 超大字号自我介绍 + 单一高饱和圆形视觉符号 + 作品卡片轮播 | 用一句"我是谁 + 在哪做什么"建立记忆点；单一强符号比堆装饰更有效 |
| 2 | [paco.me](https://paco.me) | 设计工程师 | Next.js，HTML ≈11KB | 纯文本；Building / Projects / Writing 三栏索引；⌘K 提示；Now 区块 | 极简也能高级；索引式信息架构适合内容不多但质量高的站点 |
| 3 | [shud.in](https://shud.in) | 工程师 / 写作者 | Next.js，HTML ≈20KB | 左侧竖排导航（about / thoughts / projects / guestbook），正文克制 | 把"写作"与"留言"做成一等入口，增加回访理由 |
| 4 | [jhey.dev](https://jhey.dev) | 创意开发者 | **Astro**（generator 标记），HTML ≈31KB | 手绘签名、网格背景、Latest 实验清单、天气/时间/游戏状态小组件 | 个性来自细节：签名、状态、实验列表，而不是复杂 3D |
| 5 | [emilkowal.ski](https://emilkowal.ski) | 设计工程师 | Next.js，HTML ≈24KB | 大面积留白，Today / Projects 两段式 | 留白与节奏本身就是设计；项目描述一句话即可 |
| 6 | [leerob.io](https://leerob.io) | 工程师 / 作者 | Next.js，HTML ≈720KB（RSC 输出） | 左文右插画；Default/Long bio 切换；Notes 双栏 + Blogs 时间线 | 插画建立品牌；长短 bio 兼顾扫读与深读；内容分栏清晰 |
| 7 | [brittanychiang.com](https://brittanychiang.com) | 前端作品集 | Next.js，HTML ≈63KB | 本次截图加载超时，仅作参考 | 经典作品集结构；仓库 MIT 但 2024-07 后停更，模板需评估维护性 |
| 8 | [joshwcomeau.com](https://www.joshwcomeau.com) | 教学型博客 | Next.js，HTML ≈118KB | 本次未截图，仅作参考 | 交互式教学与插画是差异化方向 |

### 2.1 开源参考

| 仓库 | Stars | 许可证 | 最近推送（实测） | Demo |
|---|---|---|---|---|
| [bchiang7/v4](https://github.com/bchiang7/v4) | 8,286 | MIT | 2024-07-28 | [brittanychiang.com](https://brittanychiang.com) |
| [leerob/leerob.io](https://github.com/leerob/leerob.io) | 7,574 | 无 LICENSE | 2026-09-16 | [leerob.io](https://leerob.io) |
| [satnaing/astro-paper](https://github.com/satnaing/astro-paper) | 5,145 | MIT | 2026-10-21 | [astro-paper.pages.dev](https://astro-paper.pages.dev) |
| [once-ui-system/magic-portfolio](https://github.com/once-ui-system/magic-portfolio) | 1,416 | 非标准许可 | 2026-10-20 | [demo.magic-portfolio.com](https://demo.magic-portfolio.com) |
| [shuding/shud.in](https://github.com/shuding/shud.in) | 217 | 无 LICENSE | 2026-10-22 | [shud.in](https://shud.in) |

> 结论：高星不等于可复用。`leerob.io` 与 `shud.in` 无 LICENSE，`magic-portfolio` 为非标准许可，只有 `v4` 与 AstroPaper 是 MIT；但 `v4` 已停更，AstroPaper 是博客模板而非多领域作品集。

## 3. 本站与优秀站点的差距

| 维度 | 优秀站点做法 | 本站 v1.2.0 现状 | 判断 | 优先级 |
|---|---|---|---|---|
| 个人叙事 | 首屏一句话说清"我是谁、在哪、做什么"（rauno、paco） | 姓名 + 角色 + 泛化 tagline（"把数据、模型与系统落到产品里"） | 缺少具体主张与可记忆的定位 | P0 |
| 视觉签名 | 单一强符号：黄色圆形、插画、手绘签名 | 编辑式排版 + 编号 + 领域色；封面为程序化生成 | 有秩序但缺少一个"只属于你"的视觉记忆点 | P1 |
| 项目证据 | 截图、Demo、指标、外部链接 | 12 个案例结构完整，但无真实截图、仓库/演示链接、量化结果 | 可信度与"可点开验证"不足 | P0 |
| 写作 | 独立 thoughts/notes 入口，持续更新（shud、leerob） | 3 篇种子笔记，入口已建 | 有系统但内容密度不足 | P1 |
| 页面类型 | now / uses / guestbook / experiments | 首页/项目/笔记/关于/简历/搜索 | 缺少"当下状态"与"使用工具"两类高个性页面 | P1 |
| 个性细节 | 天气、时间、游戏状态、签名、bio 切换 | 主题、筛选、搜索、视图过渡；无状态小组件 | 功能完整但"人味"偏少 | P2 |
| 内容节奏 | 博客持续更新，列表按时间组织 | 笔记按日期，3 篇 | 需固定节奏而非一次性发布 | P1 |
| 技术栈 | 多数 Next.js；jhey 与 AstroPaper 为 Astro | Astro 7 + 静态输出 | 栈不是差距；本站默认 JS 更轻 | — |
| 工程与开源 | 多数站点无测试/文档；部分无 LICENSE | 18 篇文档 + 12 ADR + 26 单测 + 34 E2E + 预算门禁 | **本站明显更强** | 优势 |
| 可访问性/SEO | 未逐站验证 | axe 9 页 0 serious、SEO 审计、JSON-LD/OG/RSS | **本站更系统** | 优势 |
| 上线状态 | 均为公开可访问 | 仅本地预览，无公网地址 | 最大的落地差距 | P0 |

### 3.1 区别（不是差距）

- **个性驱动 vs 系统驱动**：优秀站点第一屏先给"人"，本站第一屏先给"结构与证据"。两者不冲突，但本站需要补前者。
- **单点极致 vs 广度覆盖**：rauno/paco 只展示少量精选；本站覆盖 7 个领域、12 个案例。广度是差异化，但需要用更强的叙事把广度收束成一句话。
- **Next.js 主流 vs Astro 少数**：栈差异不影响观感；本站的静态输出与预算控制在工程上更可控。

## 4. 本站已有的优势（应保留）

1. **多领域结构化案例**：领域/标签/状态/指标字段完整，支持筛选、排序、搜索与 URL 状态。
2. **工程可信度**：18 篇文档、12 篇 ADR、内容校验、SEO 审计、体积预算、axe、Lighthouse、CI 全链路。
3. **可验证的质量**：Perf/A11y/BP/SEO 全 1.0（6 页），LCP ≈1.5s，CLS ≈0。
4. **机器可读**：sitemap、RSS、projects.json、JSON-LD、OG、LQIP。
5. **开源合规**：MIT + 社区文件 + 无运行时后端。

## 5. 建议的改进路线（v1.3 候选）

### P0：上线前必须

1. **公开部署**：GitHub Pages（或 Cloudflare Pages）+ 自定义域名；补 `SITE_URL` / `BASE_PATH`。
2. **项目证据**：为每个案例补 1–3 张真实截图或架构图、仓库/Demo/论文链接；没有量化数据时写清验证方式。
3. **Hero 重写**：一句具体主张（行业 + 方法 + 结果），保留姓名与角色；增加长短 bio 切换或折叠。
4. **头像/插画决策**：使用真人照片、插画或字母标识，三者选一，避免"无脸"站点。

### P1：1–2 个月

5. **新增 `/now` 与 `/uses`**：当前在做什么、常用工具与设备；两者都是低成本高个性页面。
6. **案例模板增强**：`Figure` / `Gallery` 组件、结果指标区、关键决策图；补全 gallery 字段的使用。
7. **写作节奏**：笔记从 3 篇到 6–8 篇，形成"选型 / 性能 / 内容工程"三个固定栏目。
8. **命令面板**：把当前"⌘K 跳转搜索"升级为导航 + 主题 + 搜索的统一面板。

### P2：3–6 个月

9. **实验/Playground 索引**：小型交互实验（CSS/Canvas），呼应 jhey.dev 的做法。
10. **Guestbook / Newsletter**：需要后端或第三方服务，先评估隐私与维护成本。
11. **英文版**：内容就绪后再启用 i18n 路由，避免空页面。
12. **个性化视觉符号**：在现有编辑式排版上增加一个可复用母题（如领域网格、编号系统动画），不引入重型 3D。

## 6. 演示链接

### 6.1 本站（本地预览）

- 首页：http://127.0.0.1:4321/
- 项目库：http://127.0.0.1:4321/projects/
- 笔记：http://127.0.0.1:4321/notes/
- 简历：http://127.0.0.1:4321/cv/
- 搜索：http://127.0.0.1:4321/search/

> 说明：当前没有公网部署，以上为本地预览地址；需要本机运行 `pnpm preview`。公网地址需要创建远程仓库并配置部署变量。

### 6.2 参考站点

- [rauno.me](https://rauno.me)
- [paco.me](https://paco.me)
- [shud.in](https://shud.in)
- [jhey.dev](https://jhey.dev)
- [emilkowal.ski](https://emilkowal.ski)
- [leerob.io](https://leerob.io)
- [brittanychiang.com](https://brittanychiang.com)
- [joshwcomeau.com](https://www.joshwcomeau.com)

### 6.3 开源 Demo

- [AstroPaper Demo](https://astro-paper.pages.dev)
- [Magic Portfolio Demo](https://demo.magic-portfolio.com)

## 7. 结论

本站的工程完成度、文档与质量门禁已超过多数同类个人站点；真正的差距在**个人叙事、项目证据与上线状态**，而不是技术栈或页面数量。下一阶段应优先把"可验证的作品"和"可记忆的人"补上，再考虑实验、CMS 与英文版。

## 8. 2026-10 前端视觉复核

参考对象：Brittany Chiang、Lee Robinson、Josh Comeau、Rauno Freiberg、Emil Kowalski，以及 Linear、Vercel、Stripe 的营销/文档界面。

### 8.1 共性

大多数成熟个人站不是"元素越多越好"，而是：

1. **一个记忆点**：超大姓名/主张 + 克制的单色强调色。
2. **中性底色**：暖白或近黑；正文对比度高，装饰不抢内容。
3. **大留白**：区块间距明显大于组件内部间距。
4. **少而稳定的强调色**：链接、按钮、状态；不把整个页面做成渐变。
5. **案例优先**：卡片先给问题/结果，技术栈和指标是辅助信息。
6. **动效克制**：淡入、hover、视图过渡足矣；滚动绑定动画容易抖动。

### 8.2 本站对照

| 维度 | 本站 | 判断 |
|---|---|---|
| 色彩 | 暖白底 + 朱砂色单强调 + 深色主题 | 保留；有辨识度且对比度通过 |
| 字体 | Geist + JetBrains Mono + 中文回退 | 保留；层级清楚 |
| 背景 | 纯 CSS 极光/透视网格 | 保留；无图片/JS 成本 |
| 项目卡 | 3 列，封面 + 标题 + 摘要 | 改为 **2 列**，提升封面与摘要可读性 |
| GitHub 卡 | 3 列，工程与考试资料混排 | 改为 **2 列 + 工程/资料分组** |
| 动效 | 视图过渡、hover；无滚动绑定 | 保留 |
| 证据 | 生成封面、无真实截图 | 最大缺口；不是配色问题 |

### 8.3 决策

1. **不改主色**：朱砂色与暖白已经形成识别；换成常见蓝/紫会失去区分度。继续用对比度脚本守住 AA。
2. **项目库 3 → 2 列**：当前 1280px 下封面里的中文说明偏小；2 列让封面和摘要重新可读。
3. **GitHub 索引分组**：工程与产品在前，工具/学习资料在后；不再把考试资料与工程案例混在一起。
4. **不引入 WebGL/Three.js/Spline**：个人站收益低，包体与维护成本高；背景继续纯 CSS。
5. **优先补真实截图**：配色和布局已足够成熟，真实证据比继续换皮更重要。

### 8.4 参考

- https://brittanychiang.com
- https://leerob.io
- https://www.joshwcomeau.com
- https://rauno.me
- https://emilkowal.ski
- https://linear.app
- https://vercel.com
- https://stripe.com

