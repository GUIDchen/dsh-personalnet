---
文档编号: 02
标题: 软件需求规格说明
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 软件需求规格说明（SRS）

## 1. 角色与画像

### 1.1 Persona A：技术面试官

- 目标：5 分钟内判断候选人是否真的做过项目。
- 行为：从首页进入项目库，按领域筛选，打开 1–2 个案例，查看技术栈与指标，再找联系方式。
- 痛点：营销式描述多、细节少；手机上看不清结构。

### 1.2 Persona B：招聘方 HR

- 目标：确认方向匹配与基本信息。
- 行为：首页 → 关于页 → 下载/复制联系方式。

### 1.3 Persona C：开源贡献者

- 目标：复用站点或提交改进。
- 行为：GitHub README → 文档索引 → CONTRIBUTING → 本地跑通。

## 2. 用户故事（User Story）

| 编号 | 用户故事 | 优先级 |
|---|---|---|
| US-01 | 作为访客，我想在首页 10 秒内知道站主是谁、做什么、如何联系 | Must |
| US-02 | 作为访客，我想按领域浏览项目，并能组合标签筛选 | Must |
| US-03 | 作为访客，我想用关键词搜索项目与正文内容 | Should |
| US-04 | 作为面试官，我想在项目详情看到问题、方案、决策与结果 | Must |
| US-05 | 作为移动端访客，我想在小屏上顺畅阅读且不横向滚动 | Must |
| US-06 | 作为访客，我想切换深/浅主题且偏好被记住 | Should |
| US-07 | 作为访客，我想分享带筛选条件的链接给他人 | Should |
| US-08 | 作为搜索引擎，我想获得结构化数据、sitemap 与规范 URL | Must |
| US-09 | 作为维护者，我想用 MDX 新增项目并自动通过校验 | Must |
| US-10 | 作为维护者，我想在 CI 中阻止性能/可访问性回归 | Must |
| US-11 | 作为贡献者，我想按贡献指南在本地跑通并提交 PR | Should |
| US-12 | 作为访客，我想在无 JavaScript 时仍能阅读全部内容 | Should |

## 3. 功能需求（Functional Requirements）

### FR-01 首页

**描述**：展示姓名、定位、一句话价值、主 CTA、精选项目（3 个）、领域总览（7 个，含计数）、能力矩阵、履历摘要、联系方式。

```gherkin
场景: 首页渲染核心信息
  假设 站点已构建
  当 访客访问 /
  那么 页面应包含 h1（姓名）与定位文案
  并且 精选项目数量为 3
  并且 领域总览包含全部已发布项目所属领域
  并且 存在指向 /projects/ 与 /about/ 的链接
```

### FR-02 项目库与筛选

**描述**：`/projects/` 提供领域 chips（含计数）、标签筛选、排序（精选/最新/名称）、结果计数（`aria-live`）、空态；筛选状态写入 URL。

```gherkin
场景: 按领域筛选
  假设 项目库有 12 个项目、7 个领域
  当 访客点击"计算机视觉"
  那么 仅显示该领域项目
  并且 URL 包含 ?domain=computer-vision
  并且 结果计数文本更新且可被读屏软件播报
  当 访客刷新页面
  那么 筛选状态保持
```

### FR-03 项目详情

**描述**：`/projects/<slug>/` 展示封面、元信息、指标、六段式正文、图库、相关项目、上下篇导航与目录（TOC）。

```gherkin
场景: 打开案例研究
  当 访客访问 /projects/yolo-object-detection/
  那么 页面包含 h1 与"背景/约束/方案/决策/结果/反思"六个 h2
  并且 元信息区包含角色、周期、领域、技术栈
  并且 页面注入 CreativeWork 类型的 JSON-LD
  并且 canonical 指向绝对 URL
```

### FR-04 搜索

**描述**：`/search/` 使用 Pagefind 索引；`⌘K`/`Ctrl+K` 在任何页面唤起；支持键盘操作与无结果提示。

### FR-05 关于页

**描述**：`/about/` 包含自述、技能分组、教育、经历时间线、当前在做、常用工具、联系方式。

### FR-06 主题

**描述**：深/浅/跟随系统三态；`localStorage` 记忆；首屏无闪烁；`prefers-color-scheme` 变化时跟随（未手动选择时）。

### FR-07 元数据与机器可读输出

**描述**：每页唯一 title/description、canonical、OG/Twitter Card、JSON-LD；输出 `/sitemap-index.xml`、`/rss.xml`、`/robots.txt`、`/projects.json`。

### FR-08 内容校验

**描述**：构建期用 Zod 校验 frontmatter；缺失 `alt`、非法 `domain`、summary 超长等直接失败并给出字段路径。

### FR-09 无 JS 降级

**描述**：禁用 JavaScript 时，全部项目卡片与正文仍可见；筛选退化为"显示全部 + 领域锚点"；主题跟随系统。

### FR-10 404

**描述**：任意不存在路径返回品牌化 404 页面（GitHub Pages 自动使用 `404.html`），并提供返回首页/项目库链接。

### FR-11 英文详情

**描述**：12 个项目、6 篇笔记有独立英文正文与 /en 详情路由；中英文同 slug、hreflang 双向；缺失英文正文时检查失败。

### FR-12 实验与时间线

**描述**：/experiments/ 提供静态优先的 WebGL 实验（可播放/暂停、reduced-motion、无 WebGL 降级）；/timeline/ 提供项目周期、领域分布、经历与可访问表格。

### FR-13 安全与性能探测

**描述**：Cloudflare 输出 CSP/HSTS/COOP 响应头；提供 pnpm perf:scroll 本机滚动帧率基线；GitHub Pages 保留 meta CSP。

## 4. 非功能需求（NFR）

| 编号 | 类别 | 要求 | 验证 |
|---|---|---|---|
| NFR-01 | 性能 | 移动端 LH：Perf ≥95、A11y=100、BP ≥95、SEO=100 | LHCI |
| NFR-02 | 性能 | LCP ≤1.8s、CLS ≤0.05、TBT ≤150ms（4G 节流） | LHCI |
| NFR-03 | 体积 | 首页 JS ≤25KB、详情页 ≤40KB、搜索页 ≤60KB（gzip） | `check-budget` |
| NFR-04 | 体积 | CSS ≤30KB（gzip）；字体 ≤2 个 woff2、≤120KB | `check-budget` |
| NFR-05 | 可访问性 | WCAG 2.2 AA；axe 0 serious/critical；键盘全流程；200% 缩放 | axe + 手工 |
| NFR-06 | 兼容性 | 最近两个版本 Chrome/Edge/Firefox/Safari；不支持 View Transitions 时降级 | Playwright 多浏览器 |
| NFR-07 | SEO | 唯一 title/description；canonical；sitemap；结构化数据可解析 | 集成测试 |
| NFR-08 | 安全 | 无第三方脚本；CSP 启用；依赖审计通过；无密钥入库 | CI + 审查 |
| NFR-09 | 隐私 | 默认无分析、无 Cookie；发布内容通过脱敏检查 | `check-privacy` |
| NFR-10 | 可维护性 | 新增项目只改内容文件；类型检查 0 error；单测覆盖率 ≥80% | CI |
| NFR-11 | 构建 | 冷构建 ≤90s（本地 M 系列）；CI 构建 ≤5min | CI 计时 |
| NFR-12 | 国际化就绪 | UI 文案集中管理；项目/笔记正文双语；hreflang 双向 | check:translations + E2E |
| NFR-13 | 安全头 | Cloudflare CSP/HSTS/COOP；GitHub Pages meta CSP | check:security + curl |
| NFR-14 | 恢复 | 代码/内容 RPO 0，站点 RTO ≤30 分钟 | 恢复演练（37） |

## 5. 需求优先级（MoSCoW）

| 级别 | 需求 |
|---|---|
| Must | FR-01、FR-02、FR-03、FR-06、FR-07、FR-08、FR-09、FR-10；NFR-01/02/05/07/08/09/10 |
| Should | FR-04、FR-05（基础版为 Must，增强为 Should）；US-07、US-11、US-12 |
| Could | OG 图自动生成、RSS、`projects.json`、打印样式、`/now` |
| Won't（本期） | 评论、Newsletter、分析、真 3D 引擎 |

## 6. 需求追溯矩阵

| 需求 | 设计文档 | 实现位置 | 测试 | 里程碑 |
|---|---|---|---|---|
| FR-01 | 07 §3.1 | `src/pages/index.astro` | 集成 + e2e | M3 |
| FR-02 | 07 §3.2 | `src/pages/projects/index.astro`、`src/lib/facets.ts` | 单测 + e2e | M3 |
| FR-03 | 07 §3.3 | `src/pages/projects/[slug].astro` | 集成 + e2e | M3 |
| FR-04 | 07 §3.5 | `src/pages/search.astro` | e2e | M4 |
| FR-05 | 07 §3.4 | `src/pages/about.astro` | e2e | M3 |
| FR-06 | 06 §6 | `src/components/layout/ThemeToggle.astro` | e2e | M2 |
| FR-07 | 09 §2–4 | `src/lib/seo.ts`、`src/pages/rss.xml.ts` | 集成 | M3/M4 |
| FR-08 | 08 §2 | `src/content.config.ts`、`tests/unit/content-schema.test.ts` | 单测 | M3 |
| FR-09 | 07 §5 | 渐进增强脚本 | e2e（禁用 JS） | M3 |
| FR-10 | 07 §3.6 | `src/pages/404.astro` | e2e | M3 |
| FR-11 | 21 | `src/pages/en/projects/[slug].astro`、`src/pages/en/notes/[slug].astro` | check:translations + e2e | v2.9 |
| FR-12 | 07/22 | `src/pages/experiments.astro`、`src/pages/timeline.astro` | e2e + axe | v2.9 |
| FR-13 | 12/09 | `public/_headers`、`scripts/scroll-fps.mjs` | check:security + perf:scroll | v2.9 |
| NFR-01/02 | 09 §5 | LHCI 配置 | `pnpm perf` | M5 |
| NFR-03/04 | 09 §5 | `scripts/check-budget.mjs` | `check:budget` | M4 |
| NFR-05 | 09 §6 | 组件 + axe | `test:a11y` | M5 |
| NFR-08/09 | 12 | CSP、`check-privacy` | CI | M5 |
| NFR-10 | 10 | 全量测试 | `ci:verify` | M5 |

## 7. 验收定义（Definition of Done）

一个需求被视为完成，需同时满足：

1. 代码实现并通过 `pnpm lint && pnpm check && pnpm test`。
2. 对应测试用例存在且通过。
3. 相关文档（07/08/09/16）同步更新。
4. 性能与体积预算未回归。
5. 新增 UI 通过 axe 扫描与键盘检查。
6. `CHANGELOG.md` 记录。