---
文档编号: 03
标题: 技术方案调研（前端、后端与周边生态）
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 技术方案调研

> 调研方法与数据截止：2026-10-23。版本号来自 npm registry 实测，社区数据来自 GitHub API（stars 为当日快照），文档行为来自官方文档。
> 结论只服务一个目标：**个人作品集站点**（静态优先、多领域项目展示、设计上限高、可开源），不是通用 Web 应用选型。

## 1. 调研问题

1. 用哪种站点框架，能在"内容建模、性能、设计自由度、长期维护"之间取得最优？
2. 是否需要运行时后端？如果需要，开源方案有哪些，代价是什么？
3. 搜索、分析、CMS、评论等周边能力，哪些值得纳入、哪些应显式排除？
4. 现成开源模板能否直接复用？许可证是否允许？

## 2. 候选方案画像（前端/站点框架）

### 2.1 Astro 7

- 当前版本：**7.4.2**；要求 Node ≥22.23.4（`engines` 实测）。
- 定位：内容优先的静态站点框架，默认零客户端 JS，islands 架构，支持 React/Vue/Svelte/Solid 等作为可选交互层。
- 关键能力：Content Collections（Content Layer + Zod 校验）、MDX、`astro:assets` 图片优化、`<ClientRouter />` 视图过渡、内置 i18n 路由、sitemap/RSS 官方集成、CSP（`security.csp`，v6 起稳定）、fonts API（v6 起稳定）。
- 7.0 重要变更（[升级指南](https://docs.astro.build/en/guides/upgrade-to/v7/)）：Vite 8、Rust 编译器、默认 Markdown 管线换成 **Sätteri**（不再默认安装 `@astrojs/markdown-remark`）、`compressHTML` 默认值变化。
- 生态证据：GitHub 63.4k★，近 24 小时有推送；`@astrojs/mdx` 8.1.1、`@astrojs/sitemap` 3.7.4、`@astrojs/rss` 4.0.19 均在维护。
- 适配度：**高**。作品集本质是"内容集合 + 少量交互"，与 Astro 的设计目标完全重合。

### 2.2 Next.js 16

- 当前版本：**16.4.2**；React Server Components 为主范式。
- 优势：生态最大（143k★）、招聘市场认知度高、Vercel 部署体验好、与 Payload 3 等开源 CMS 深度集成。
- 代价：为静态作品集引入 RSC/缓存/服务端概念，认知与构建开销偏高；默认客户端 JS 体积高于 Astro；免费托管条款对商业用途有限制。
- 适配度：中高。若未来站点演进为"带后台的内容平台"，Next + Payload 是成熟组合。

### 2.3 Nuxt 4 + Nuxt Content

- 当前版本：**4.6.2**；Vue 生态，Nuxt Content 提供 Markdown 内容层与查询 API。
- 优势：内容建模能力接近 Astro，Vue 组件开发体验好，SSG/SSR 一体。
- 代价：默认 hydration 成本高于 Astro；生态规模小于 React/Next；本项目不需要 SSR。
- 适配度：高，是本次评分的第二名。

### 2.4 SvelteKit 3

- 当前版本：**3.1.0**；编译时框架，运行时体积小。
- 优势：交互代码优雅、性能好、学习曲线平缓。
- 代价：内容层需自建或依赖 mdsvex；生态与模板数量明显少于 Astro/Nuxt；招聘市场认知度较低。
- 适配度：中。

### 2.5 Eleventy 3

- 当前版本：3.x；GitHub 19.9k★，MIT。
- 优势：极简、构建快、输出干净，模板语言灵活。
- 代价：无组件模型与类型安全，复杂交互与设计系统需要额外工程；内容 schema 需自建。
- 适配度：中低（对"设计驱动 + 可维护组件库"的目标支撑不足）。

### 2.6 Hugo

- 当前版本：持续维护（90.2k★，Apache-2.0），Go 模板，构建极快。
- 优势：单二进制、零依赖、构建速度顶级。
- 代价：模板语言表达力弱，组件化与类型安全差，现代交互需大量手写 JS；设计上限受限于主题体系。
- 适配度：低。

### 2.7 现成开源模板二次开发

代表项目（GitHub API 实测）：

| 模板 | Stars | 许可证 | 最近推送 | 备注 |
|---|---|---|---|---|
| [AstroPaper](https://github.com/satnaing/astro-paper) | 5,144 | MIT | 2026-10-21 | 博客优先，作品集能力弱 |
| [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) | 1,416 | **Other（Once UI 自定义）** | 2026-10-20 | 视觉优秀，但许可证非标准开源 |
| [leerob.io](https://github.com/leerob/leerob.io) | 7,574 | **无 LICENSE 文件** | 2026-09-16 | 个人站标杆，但不可直接复用代码 |
| [Astro Nano](https://github.com/markhorn-dev/astro-nano) | 951 | MIT | 2025-06-16 | 已约 16 个月未更新 |

结论：热门模板要么许可证受限，要么停更，要么偏博客；**二次开发会继承技术债与合规风险**，且难以满足"7 领域 + 结构化案例"的定制需求。

### 2.8 SaaS 建站（Framer / Webflow / Notion 系）

- 优势：上手快、模板美观、零运维。
- 代价：导出与迁移受限、SEO 结构可控性差、无法开源、按量/按月付费、深度定制需平台能力。
- 适配度：低（与"可开源、可长期维护、可编程"目标冲突）。

## 3. 样式与 UI 方案

| 方案 | 版本 | 优势 | 代价 | 结论 |
|---|---|---|---|---|
| Tailwind CSS 4 | 4.3.3 | CSS-first `@theme`、构建快、与 Vite 8 集成（`@tailwindcss/vite` peer 含 `^8`） | 需要设计令牌纪律，否则类名膨胀 | **采纳** |
| shadcn/ui + Radix | 持续更新 | 可访问性扎实、组件即源码 | 主要面向 React，Astro 中需引入 React island，增加框架体积 | 评估（本期不用） |
| UnoCSS | 活跃 | 原子化、按需生成 | 生态与文档弱于 Tailwind | 不采纳 |
| Panda CSS | 活跃 | 类型安全、零运行时 | 学习成本高、社区小 | 不采纳 |
| Motion / GSAP | motion 14.6 / gsap 3.15 | 复杂动效能力强 | 增加 JS 预算；CSS 已能覆盖本站动效 | 不采纳（用 CSS + View Transitions） |
| Three.js / R3F | three 0.186 | 3D 表现力 | 性能与维护成本高 | 不采纳 |

## 4. 内容与后端方案

### 4.1 无后端（Git 工作流）

- 内容以 MDX + frontmatter 存在仓库，PR 审阅，CI 校验，构建即发布。
- 优点：零运维、零成本、版本可追溯、天然可开源。
- 缺点：非技术用户编辑体验一般；实时协作弱。
- 结论：**本期采用**；通过 `docs/08` 与脚手架脚本降低编辑门槛。

### 4.2 Git-based CMS（可选增强）

| 方案 | 版本/Stars | 许可证 | 评价 |
|---|---|---|---|
| [Sveltia CMS](https://github.com/sveltia/sveltia-cms) | 2,988★ | MIT | Decap 的现代替代，活跃（2026-10-23 有推送），轻量，适合静态站 |
| [Decap CMS](https://github.com/decaporg/decap-cms) | 19,442★ | MIT | 成熟但历史包袱重，438 个 open issues |
| Keystatic | 0.6.9 | MIT | 类型安全好，但仍 pre-1.0，API 可能变化 |

结论：列为 M7 可选能力，默认不接入。

### 4.3 自建运行时后端（明确排除）

| 方案 | Stars | 说明 | 排除理由 |
|---|---|---|---|
| Payload 3 | 45.4k | Next.js 原生 headless CMS + 后台 | 需要 Node 运行时与数据库；个人站无此需求 |
| Strapi 5 | 5.x | 成熟 headless CMS | 同上，且运维成本高 |
| Directus 12 | 活跃 | 数据库优先的 headless 平台 | 同上 |

若未来需要"在线编辑 + 草稿流"，升级路径为 Git-based CMS 优先，其次 Payload + Next 独立后台；**不改变主站静态架构**。

## 5. 周边能力

| 能力 | 候选 | 结论 |
|---|---|---|
| 静态搜索 | [Pagefind](https://github.com/pagefind/pagefind) 1.5.2（5.5k★，MIT）+ astro-pagefind 2.0.1 | 采纳：构建期建索引，运行时零服务 |
| 搜索（服务端） | Meilisearch / Typesense / Algolia | 不采纳：需要服务或付费 |
| 评论 | Giscus（GitHub Discussions） | 不采纳：维护与审核成本 |
| 分析 | [Umami](https://github.com/umami-software/umami) 39.6k★、Plausible、GoatCounter | 默认关闭；预留环境变量开关 |
| 部署 | GitHub Pages / Cloudflare Pages / Netlify / Vercel | 采纳 Pages 双通道 |
| OG 图 | astro-og-canvas 0.13.2 | 采纳（构建期生成，可回退） |
| 测试 | Vitest 5.0.5、Playwright 1.64.1、axe-core 4.14.0、LHCI 0.15.1 | 采纳 |
| Lint | ESLint 10.13 + eslint-plugin-astro 3.2.1 + typescript-eslint 8.72 + Prettier 3.9.10 | 采纳 |

## 6. 版本兼容性雷区（实测）

| 雷区 | 事实 | 决策 |
|---|---|---|
| TypeScript 版本 | latest 为 7.0.2，但 `@astrojs/check@0.9.12` peer 为 `^5.0.0 || ^6.0.0`，`typescript-eslint@8.72` 要求 `<6.1.0` | 锁 **6.0.3** |
| Astro 7 Markdown | 默认 Sätteri，`@astrojs/markdown-remark` 不再默认安装；MDX 8.1.1 同时 peer 依赖 remark 与 satteri 包 | 安装三件套；内容只用 GFM + Astro 组件 |
| Vite 版本 | Astro 7 用 Vite 8；Vitest 5 peer 已支持 `^8` | 可行 |
| ESLint 10 与 jsx-a11y | `eslint-plugin-jsx-a11y@6.10.2` 的 peer 为 ESLint ≤9，而 `eslint-plugin-astro@3.2.1` 要求 ESLint ≥10 | 不引入 jsx-a11y 插件，可访问性由 axe + 手工走查覆盖 |
| 中文 Web 字体 | CJK 全量字体通常 3–8MB | 系统字体栈 + 拉丁子集 |
| Pagefind 子路径 | 索引路径依赖部署 base | 用 `BASE_PATH` 专项构建验证 |
| 模板许可证 | Magic Portfolio 为自定义许可，leerob.io 无 LICENSE | 不复制其代码 |

## 7. 技术雷达

| 环 | 技术 |
|---|---|
| **Adopt** | Astro 7、TypeScript 6、Tailwind CSS 4、Content Collections + Zod、MDX、Pagefind、Vitest、Playwright、ESLint + Prettier、pnpm、GitHub Pages |
| **Trial** | View Transitions（`ClientRouter`）、CSS scroll-driven animations、astro-og-canvas、Sveltia CMS、Umami、Sätteri 自定义插件 |
| **Assess** | Payload 3、Keystatic、TypeScript 7（等 `@astrojs/check` 支持）、React islands（仅在复杂交互出现时） |
| **Hold** | remark/rehype 插件迁移、重型 WebGL/3D、运行时自建后端、非宽松许可模板 |

## 8. 调研结论

1. **Astro 7 是当前最匹配的方案**：静态输出天然满足性能与零运维，Content Layer 满足类型安全内容建模，islands 保留未来交互扩展能力。
2. **不引入运行时后端**：个人站的后端需求可以由"Git + CI + 构建期生成"完全覆盖。
3. **不 fork 现成模板**：许可证与定制成本双重原因，自建设计系统更可控。
4. **主动规避生态迁移风险**：只用 GFM + Astro 组件，不依赖 remark/rehype 插件；版本锁死并记录 ADR。
5. 具体量化对比与结论推导见 `04-technology-comparison.md`；决策记录见 `adr/0001`–`adr/0012`。