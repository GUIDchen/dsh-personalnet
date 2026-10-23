# dsh-personalnet

> 个人网站：以 7 个领域、12 个真实项目案例展示履历与作品集。静态优先、零运行时后端、MIT 开源。

[![文档](https://img.shields.io/badge/docs-17%20%E7%AF%87-4B5563)](#文档)
[![License: MIT](https://img.shields.io/badge/license-MIT-2F855A)](./LICENSE)

## 状态

| 里程碑 | 内容                                  | 状态      |
| ------ | ------------------------------------- | --------- |
| M0     | 调研、对比、架构、12 篇 ADR、文档基线 | ✅ 完成   |
| M1     | Astro 7 工程脚手架 + CI               | 🚧 进行中 |
| M2     | 设计系统与页面骨架                    | ⏳        |
| M3     | 内容模型与全部页面                    | ⏳        |
| M4     | 搜索、动效、OG、图片优化              | ⏳        |
| M5     | 质量门禁（单测/E2E/a11y/性能）        | ⏳        |
| M6     | MIT 开源发布 v1.0.0                   | ⏳        |

## 技术栈

| 层   | 选择                                               |
| ---- | -------------------------------------------------- |
| 框架 | Astro 7（静态输出、islands）                       |
| 语言 | TypeScript 6（`@astrojs/check` 当前不支持 TS 7）   |
| 样式 | Tailwind CSS 4 + OKLCH 设计令牌                    |
| 内容 | Content Collections + Zod + MDX                    |
| 搜索 | Pagefind（构建期索引，零服务）                     |
| 测试 | Vitest 5、Playwright 1.64、axe-core、Lighthouse CI |
| 部署 | GitHub Pages（主）/ Cloudflare Pages（备）         |
| 许可 | MIT                                                |

选型依据见 [技术调研](./docs/03-research-landscape.md) 与 [方案对比](./docs/04-technology-comparison.md)。

## 快速开始

```bash
# 需要 Node ≥22.23.4、pnpm ≥7.1
pnpm install
pnpm dev        # http://localhost:4321
```

常用命令（M1 起可用）：

```bash
pnpm build          # 生产构建
pnpm preview        # 预览构建产物
pnpm check          # astro check（类型 + 内容 schema）
pnpm lint           # ESLint
pnpm test           # 单元测试
pnpm test:e2e       # Playwright
pnpm perf           # Lighthouse CI
pnpm test:docs      # 校验文档索引与结构
```

## 目录结构

```
.
├─ docs/            # 软件工程文档（17 篇 + 12 篇 ADR）
├─ src/             # Astro 源码（页面/组件/内容/样式/逻辑）
├─ scripts/         # 内容校验、体积预算、文档检查、OG 生成
├─ tests/           # unit / integration / e2e / a11y
├─ .github/         # CI、部署、Issue/PR 模板
└─ public/          # 静态资源
```

## 文档

- [文档索引](./docs/README.md)
- 决策记录：[ADR 0001–0012](./docs/adr/)
- 需求与范围：[SRS](./docs/02-requirements.md)、[愿景](./docs/01-vision-and-scope.md)
- 设计：[设计系统](./docs/06-design-system.md)、[信息架构](./docs/07-information-architecture.md)
- 内容：[内容模型](./docs/08-content-model.md)、[迁移清单](./docs/14-content-migration.md)
- 工程：[架构](./docs/05-architecture.md)、[测试](./docs/10-testing-strategy.md)、[部署](./docs/11-deployment-operations.md)
- 安全与许可：[安全、隐私与许可](./docs/12-security-privacy-licensing.md)

## 贡献

见 [CONTRIBUTING.md](./CONTRIBUTING.md)（M6 提供）。在此之前欢迎通过 Issue 反馈。

## 许可

- 代码：[MIT](./LICENSE)
- 文字与图片：保留版权，引用请注明来源。

---

维护者：陈陇刚 · 最后更新：2026-10-23
