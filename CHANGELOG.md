# Changelog

本项目的所有重要变更记录在此文件。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

### Added

- Cloudflare Pages 构建目标（wrangler.toml、deploy-cloudflare workflow、本地 deploy:cloudflare）。
- 双站文档 docs/33；GitHub Pages 与 Cloudflare Pages 同时在线。
- _headers 在 Cloudflare 上生效（安全头、admin X-Robots、_astro 长缓存）。

### Changed

- Cloudflare Pages 已通过直接上传部署到 https://guidchen.pages.dev/；当前不是 Git 自动部署。
- deploy-cloudflare-pages workflow 改为监听 main；配置 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` 后，后台保存即可自动更新 Cloudflare 副本；未配置时只构建并跳过。

### Added

- 新增 `/feed/` 与 `/en/feed/` 订阅说明页；页脚 RSS 入口改为说明页，`rss.xml` 本身保留给阅读器。

### Fixed

- RSS 笔记 `pubDate` 原来只保留年月，统一变成每月 1 日；现在保留完整日期（如 2026-10-23）。
- 外部链接检查把 403/405 与网络错误降级为警告，404/410/5xx 仍失败。

## [2.8.0] - 2026-10-24

网络攻击面、并发与信息展示审计。

### Added

- meta CSP（public/admin 两套）、严格 referrer、`public/_headers` 预留安全头与长缓存。
- `check:privacy` 与公开展示/后台信息审计（docs/32）。
- 静态并发探测脚本 `pnpm test:load`，记录 GitHub Pages 40 请求/并发 10 的参考结果。
- 仪表盘增加"公开只读、无 token"提示。

### Changed

- 文档补充高并发模型、CSP 限制、部署方案与 P0/P1/P2 状态。
- 安全页更新 CSP 现状：meta 已启用，HSTS/frame-ancestors 仍需 CDN。

### Fixed

- 关闭 `prefetchAll` 全视口预取，降低滚动时的批量页面请求。
- 修复 GitHub sync workflow 的 detached HEAD 推送；后台源文件可正常同步。

## [2.7.0] - 2026-10-24

完成度复审与滚动/隐私收口。

### Fixed

- 关闭 `prefetchAll` 的全视口预取；滚动进入视口的卡片/链接不再批量发起页面请求。
- 补充 `check:perf` 对 `astro.config.ts` 的护栏。

### Added

- `check:privacy`：扫描手机号、身份证号与敏感字段；接入 CI 与健康报告（14 项）。
- 完成度审计更新到 v2.7.0，对照最初范围列出 90% 完成度与剩余 P0/P1。

## [2.6.0] - 2026-10-24

滚动流畅度与内容深度。

### Fixed

- 移除全屏背景的 `filter: blur(70px)` 与网格 `background-position` 动画，消除滚动时的全层重绘。
- 去掉 sticky header 的 `backdrop-filter`，避免与动态背景叠加反复重算模糊。
- 移除 `animation-timeline: view()` 的滚动绑定标题动画，降低低端设备合成抖动。
- 移动端与 reduced-motion 停止 aurora 动画。
- 新增 `check:perf` 护栏，禁止 backdrop-filter、全屏 blur 与 animation-timeline 回归。

### Changed

- 12 个项目详情新增「技术细节」，补充数据格式、训练/评估、线程/内存、图谱 schema、FPGA 流程等术语。
- 6 篇笔记新增「实现索引」，列出对应脚本、配置与配置文件路径。
- 背景调研文档补充卡顿原因分析与修复对照。

## [2.5.0] - 2026-10-24

阅读体验、安全模型与背景视觉。

### Added

- About 增加「工作原则」与「关注方向」，中英同步。
- 笔记详情增加「关键要点」，6 篇笔记补齐。
- 项目详情侧栏增加「亮点」，正文末尾增加「展示边界与技术安全」。
- 新增 `/security/`、`/en/security/` 安全模型页、`SECURITY.md` 与 `.well-known/security.txt`。
- 新增 `check:security` 安全检查（security.txt、凭据模式扫描）。
- 新增纯 CSS 环境背景：极光渐变 + 透视网格，跟随主题、支持 reduced-motion。

### Changed

- 背景研究记录在 `docs/29-background-research.md`，决策为 ADR 0019。
- 健康检查增加安全基线，共 12 项。

## [2.4.0] - 2026-10-24

GitHub 项目索引与后台同步。

### Added

- 新增 `/github/` 与 `/en/github/`：展示 13 个 curated 公开仓库，含中英摘要、语言与更新时间。
- 新增 `github-project-sources.json`（人工维护）与 `github-projects.json`（元数据生成）。
- 后台新增 `github` file collection，可编辑仓库清单；保存后触发同步 workflow。
- 新增 `sync-github-projects.yml`：每周、手动或源文件变更时同步 GitHub 元数据并提交。
- 新增 `check:github`、GitHub E2E、页脚/命令面板/项目页入口。

### Changed

- 仪表盘增加 GitHub 项目、仓库源与同步入口。
- 健康检查增加 GitHub 项目数据校验。

### Fixed

- 仓库卡片移除与可见文本不匹配的 `aria-label`，通过 axe 检查。

## [2.3.1] - 2026-10-24

后台内容编辑器登录修复。

### Fixed

- Sveltia 默认 GitHub OAuth 回退到未配置的 Netlify 端点，点击「使用 GitHub 登录」出现 `error No data`。
- 后台配置改为 `auth_methods: [token]`，登录页只保留可用的访问令牌入口。
- 仪表盘新增内容编辑器登录指引与 fine-grained token 权限说明。
- `check:admin` 增加 auth_methods 校验，禁止"启用 oauth 但无 base_url"。

### Changed

- 文档补充 token-only 原因、PAT 权限、未来 OAuth Worker 启用步骤与故障排查。

## [2.3.0] - 2026-10-23

双语内容与长期完善版本。

### Added

- 项目与笔记新增可选 `titleEn` / `summaryEn`；英文项目卡、首页笔记、笔记列表与英文简历使用英文标题/摘要。
- CMS 增加英文标题/摘要字段；`projects.json` 暴露英文元数据。
- 现有 12 个项目与 6 篇笔记补齐英文标题/摘要；正文仍为中文并标注。

### Changed

- 英文项目/笔记正文提示保持；搜索索引同时包含中英标题。

## [2.2.0] - 2026-10-23

媒体、内容证据与持续完善版本。

### Added

- 项目封面/图库改为 Sveltia image 字段，上传到 `public/media/projects/`；`ProjectMedia` 统一处理 base 路径。
- 详情页支持 CMS 封面与图库灯箱；无真实封面时回退生成封面。
- `check:media` 校验格式、单文件 300KB、总量 8MB 与引用存在。
- 后台仪表盘新增内容证据完整度（源码/封面/图库/指标/Demo 或论文）与缺失清单。
- 后台新增最新部署状态（只读 GitHub Actions API，无 token）。
- 新增 3 篇技术笔记：媒体工作流、内容健康度、JSON Feed/子路径。
- 新增 `/feed.json`（JSON Feed 1.1）并在 head 声明。

### Changed

- Sitemap、checks、admin/docs 同步 v2.2 路由与媒体字段。

### Fixed

- 笔记/RSS 从 3 篇扩到 6 篇后的计数与测试。

## [2.1.0] - 2026-10-23

后台管理平台与视觉升级。

### Added

- `/admin/` 管理仪表盘：项目/笔记/草稿/领域/待补源码统计、最近内容、快捷入口、发布流程。
- Sveltia 编辑器迁到 `/admin/cms/`，新增 `site` file collection：Profile、About、Now、Uses、技能、时间线（中英各一份）。
- 站点资料迁移到 `src/data/*.json`，保留 TS wrapper；新增 `check-site-data`。
- 项目卡加入生成封面；标题旁 GitHub 源码链接（`RepoLink`），详情/CV 同步；`projects.json` 增加 `repo`。
- 项目卡改为标题扩展点击，避免嵌套 `<a>`；GitHub 链接独立可点。
- About 页改为双栏资料卡；搜索页增加快捷关键词。

### Changed

- Sitemap 排除 `/admin/`；后台仪表盘与 CMS 均 noindex。
- 检查脚本、E2E、axe、文档与路由更新到新后台路径。

### Fixed

- 项目卡封面首屏加载与图片比例；CV 源码链接的可访问名称。

## [2.0.0] - 2026-10-23

v2.0.0：审阅借鉴、中英文界面、Sveltia 管理后台、自动化维护与 GitHub Pages 上线。

### Added

- 优秀个人网站基准调研与差距分析（docs/18）：8 个站点 + 5 个开源仓库的实测数据、差距矩阵与改进路线。
- 完成度审计（docs/19）与优秀站点借鉴笔记（docs/20）。
- 首页 Hero 重构：一句具体主张、short/long bio、可用状态与本地时间；技能/经历下沉到关于页。
- 新增 /now（在做什么/在学/在找）与 /uses（语言、AI 与数据、系统、网站技术栈、写作工具）。
- 命令面板：⌘K 统一导航、主题、复制邮箱与 RSS，支持过滤与键盘操作。
- 新增 Figure/Gallery 组件与案例证据规范；无图片时自动隐藏。
- 中英文界面：/en/ 路由、语言切换、hreflang、英文个人资料/经历/技能/Now/Uses/404。
- 英文页面标注中文正文；项目/笔记详情保持中文，语言切换回退到英文列表。
- check-seo 支持 zh-CN/en；check-dist 的 sitemap 期望值按 noindex 页面动态计算。
- Sveltia CMS 管理后台：/admin/、projects/notes 字段映射、noindex + robots 禁止、固定版本 + SRI。
- check-admin 校验字段与 Zod schema 对齐；admin E2E 覆盖配置、索引与 robots。
- 健康报告脚本（pnpm health）：内容/SEO/产物/后台/对比度/预算/链接，输出 reports/health.md。
- 每周 maintenance workflow：构建 + 检查 + artifact + 创建/更新 maintenance Issue；不自动提交。
- Agent 长跑契约（docs/23）与维护日志（docs/24）；ADR 0015 明确自动化边界。
- 部署预检 `pnpm deploy:check`；Pages 变量未设置时按仓库名推导。
- `check-dist`/`check-budget` 支持 `BASE_PATH` 子路径；上线清单 docs/25。

### Fixed

- 英文首页字体加载与本地时间更新导致的布局偏移（CLS 0.216 → 0）：字体改为 `font-display: optional` 并预加载 Geist；时间只替换等宽数字。

### Deployment

- GitHub Pages：<https://guidchen.github.io/dsh-personalnet/>
- 仓库变量 `SITE_URL=https://guidchen.github.io`、`BASE_PATH=/dsh-personalnet/`；Pages Source 为 GitHub Actions。

## [1.2.0] - 2026-10-23

内容与发现性版本：新增技术笔记、中文 SEO 审计与封面 LQIP。

### Added

- 技术笔记：`notes` 集合、`/notes/` 列表与 `/notes/<slug>/` 详情，含阅读时长、TOC、上/下一篇、相关笔记与 `BlogPosting` 结构化数据。
- 3 篇种子笔记（Astro 选型、Pagefind 搜索、CI 质量门禁），可自由替换。
- 首页“最近笔记”、顶部导航与页脚入口。
- RSS 合并项目与笔记，按日期倒序、最多 20 条。
- 中文 SEO 审计 `pnpm test:seo`：标题显示宽度、描述长度、唯一性、H1、语言与社交元数据。
- 封面 LQIP：24px WebP 内联占位，详情页首帧即有背景。
- 测试扩容：单元 26 项、E2E 34 项、axe 9 页、Lighthouse 6 页。

### Changed

- 顶部导航扩展为 5 项（新增“笔记”）；页脚新增笔记与 RSS。
- RSS 条目由 12 条变为 15 条，标题改为“项目与笔记”；依赖条目数的消费方需注意。
- 首页标题改为“陈陇刚 — 人工智能 / 数据分析 / 软件工程”；Meta 不再重复追加站点名。

### Fixed

- 平板宽度下首页联系信息换行错位（事实网格改为两列，邮箱占满一行）。
- 简历页描述过短导致的 SEO 审计失败。
- 组件目录中的过期交互钩子说明。

## [1.1.0] - 2026-10-23

维护基线版本：补齐日常运营所需的能力与文档。

### Added

- 简历页 `/cv`：A4 打印样式（隐藏站点外壳、黑白适配），可从关于页进入并导出 PDF。
- `/robots.txt` 端点：声明 sitemap 绝对地址、禁止搜索页抓取。
- `pnpm new:project <slug>`：生成带字段注释的草稿骨架，草稿不参与构建。
- `pnpm check:links`：扫描构建产物中的外部链接。
- 维护手册 `docs/17`：发布清单、依赖升级、内容运营、质量回归日历、备份与故障处理。

### Changed

- 内容校验支持草稿：草稿跳过 OG 与小节完整性检查。
- 测试与检查扩容：E2E 26 项、axe 7 页、Lighthouse 5 页、sitemap 16 个 URL。

## [1.0.0] - 2026-10-23

首个可开源版本：个人网站上线所需的内容、设计、交互、质量门禁与文档全部就绪。

### Added

- 站点：首页、项目库、项目详情、关于、搜索、404，响应式 390–1920px，深浅双主题。
- 内容：12 个真实项目案例覆盖 7 个领域；Zod schema 校验 + 内容 lint（字段、长度、标签词表、隐私）。
- 设计系统：OKLCH 令牌、对比度校验、自托管 Geist / JetBrains Mono 拉丁子集、滚动驱动入场。
- 交互：项目领域/标签筛选、三种排序、URL 状态同步、无 JavaScript 降级；Pagefind 全站搜索与 ⌘K / Ctrl+K 唤起。
- 导航：ClientRouter 视图过渡；主题、菜单、筛选脚本在客户端导航后重新初始化。
- 元数据：Person / WebSite / CreativeWork / BreadcrumbList JSON-LD、canonical、OG/Twitter 卡片。
- 资源：13 张 1200×630 OG 图；13 张 1600×1000 封面经 astro:assets 输出 AVIF/WebP/JPG（4 个宽度）。
- 机器可读输出：/rss.xml、/projects.json、/sitemap-index.xml、/robots.txt。
- 工程：Astro 7 + TypeScript 6 + Tailwind CSS 4 + MDX，pnpm 锁定依赖。
- 质量门禁：ESLint 10 / Prettier 3 / astro check / Vitest（17 项，覆盖率 98.3%）/ Playwright（22 项）/ axe（6 页）/ Lighthouse CI（4 页全 1.0）。
- 预算：首页 JS 6.0KB、详情 6.0KB、搜索 7.6KB、CSS 5.6KB、字体 68KB（gzip）。
- CI：lint、format、类型检查、覆盖率、构建、文档、内容、对比度、产物集成校验、体积预算、E2E、a11y、Lighthouse。
- 部署：GitHub Pages 工作流；Cloudflare Pages 配置写入文档。
- 文档：17 篇工程文档 + 12 篇 ADR（arc42、C4、需求追溯、测试策略、部署 runbook、安全与许可）。
- 社区：CONTRIBUTING、CODE_OF_CONDUCT、SECURITY、CITATION.cff、PR/Issue 模板、Dependabot。

### Fixed

- 项目库筛选栏由 hidden 改为首屏前由 `.js` 控制，消除 CLS 0.27 的布局偏移。
- 项目库卡片标题按页面层级渲染为 h2，消除 h1→h3 跳级。
- 视图过渡重置 `<html>` 运行态属性导致主题与移动端菜单失效的问题（`astro:after-swap`）。
- WebKit 点击按钮不聚焦导致 Esc 无法关闭菜单的问题（document 级监听）。
- 子路径部署下 canonical、sitemap、RSS、OG 地址统一走 `BASE_PATH`。

### Security

- 默认零第三方脚本、无 Cookie、无跟踪；分析默认关闭。
- 内容发布前运行隐私检查，拦截手机号与敏感字段。
- 依赖锁文件 + Dependabot + 安全披露流程。

## [0.1.0] - 2026-10-23

### Added

- 初始化 Git 仓库与目录结构。
- README、MIT LICENSE、文档索引与校验脚本。
- 技术调研（8 个候选方案）与 12 篇 ADR。
