---
文档编号: 38
标题: 上手与代码约定
状态: Approved
最后更新: 2026-10-24
维护者: 陈陇刚
---

# 上手与代码约定

面向第一次参与维护的人（或未来的自己）。目标：30 分钟内跑起来，知道改哪里、怎么验证、哪些不能碰。

## 1. 环境

| 工具 | 版本 |
|---|---|
| Node | ≥22.23.4 |
| pnpm | 12.8.1（packageManager） |
| Git | 近期版本 |

~~~bash
pnpm install
pnpm dev        # http://127.0.0.1:4321
pnpm build
pnpm preview
~~~

## 2. 仓库地图

~~~text
src/
  pages/          路由与页面装配（zh/en）
  layouts/        页面骨架
  components/     UI、项目、布局、SEO、admin
  content/        projects、projects-en、notes、notes-en
  data/           profile/domains/timeline/github 等结构化数据
  lib/            纯函数领域逻辑
  i18n/           字典与路由 helper
  styles/         设计令牌与全局样式
  assets/         封面、字体、项目媒体
public/           _headers、OG、media、admin、security.txt
scripts/          构建/校验/生成/性能工具
tests/            单元、E2E、axe、集成
docs/             工程文档与 ADR
~~~

## 3. 分层边界

- pages：取数、组合组件、设置 SEO；不写复杂业务规则。
- components：props 驱动；不直接读内容集合或文件系统。
- lib：纯函数；不依赖 DOM，便于单测。
- content：事实与正文；schema 在 src/content.config.ts。
- data：个人结构化数据；长文放 content。
- scripts：构建/检查；不参与页面渲染。

新增依赖前先问：能否用平台能力/现有库？是否影响 CSP、包体、构建时间？

## 4. 常用命令

~~~bash
pnpm lint
pnpm format:check
pnpm check
pnpm test:unit
pnpm build
pnpm test:e2e
pnpm test:a11y
pnpm perf
pnpm ci:verify
pnpm health
pnpm check:translations
pnpm perf:scroll
~~~

## 5. 代码约定

- TypeScript strict；优先纯函数与显式类型；避免 any。
- 别名 @/ 指向 src；相对导入仅同目录。
- Astro 组件 PascalCase；工具 camelCase；内容文件 kebab-case。
- CSS 用设计令牌；不写魔法色值；优先逻辑属性。
- 客户端脚本保持最小；交互按需加载；尊重 reduced-motion。
- 不引入运行时后端、分析脚本或第三方字体 CDN。
- 不在页面硬编码 base path；用 BASE_URL/localizePath。

## 6. 内容约定

- 项目六段式：背景与问题、约束、方案与架构、关键决策、结果与度量、反思。
- 事实/指标必须有来源；缺证据写 todo，不编造。
- 中文主条目 + 英文正文独立文件；英文侧栏字段在中文 frontmatter。
- 新增项目/笔记后运行 check:translations；缺英文正文 CI 失败。
- 图片必须有 alt；媒体路径与证据清单见 27。

## 7. 国际化与路由

- 中文根路径；英文 /en/ 前缀。
- 详情页中英文同 slug；hreflang 双向。
- 新增页面：中文页面接受 lang?: Lang；英文薄包装；更新 sitemap/测试。
- 语言切换用 switchLanguagePath，不手写字符串拼接。

## 8. 测试与评审

- 先写失败测试（可行时），再最小实现。
- UI 改动附桌面/移动截图；交互改动补 E2E。
- 内容改动补 check:content/translations；安全改动补 check:security。
- PR 描述：变更、验证、截图、文档。

## 9. 常见坑

| 现象 | 原因 | 处理 |
|---|---|---|
| 子路径链接 404 | 手写 /path 而非 BASE_URL | 用 localizePath/import.meta.env.BASE_URL |
| 英文详情 404 | 缺 projects-en 文件 | 新增 body 并跑 check:translations |
| 后台保存后无更新 | token/commit/deploy 失败 | 看 GitHub Actions 与 admin 提示 |
| 搜索无结果 | Pagefind 索引未构建/语言 | build 后再预览；确认索引 |
| CSP 阻断脚本 | header/meta 交集 | 查 console，只加必要来源 |
| CI 性能失败 | 共享 runner 抖动 | 重跑；保留本地 LHCI 证据 |

## 10. 交接清单

- [ ] 能本地 dev/build/preview
- [ ] 知道内容、翻译、路由、样式分别改哪里
- [ ] 能运行 ci:verify 与解释失败项
- [ ] 知道部署、回滚、token 轮换入口
- [ ] 读过 05/10/12/17/34/35/37
