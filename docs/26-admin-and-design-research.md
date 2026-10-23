---
文档编号: 26
标题: 后台与视觉升级调研
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 后台与视觉升级调研

> 调研时间：2026-10-23。Stars/许可来自 GitHub API，仅作活跃度参考；站点视觉判断来自现有截图与公开页面。

## 1. 后台项目对比

| 项目 | 许可 / 规模 | 运行形态 | 适配结论 |
|---|---|---|---|
| [Sveltia CMS](https://sveltiacms.app) | MIT，约 3k★ | 纯静态 SPA + Git，本地 File System Access / GitHub | **保留为编辑内核**：Markdown、媒体、simple/editorial 工作流、零后端 |
| [Keystatic](https://keystatic.com) | MIT，约 2.4k★ | Astro 集成，本地/GitHub 模式 | 表单体验好；GitHub 模式需要额外 App/适配层，替换成本高 |
| [Decap CMS](https://decapcms.org) | MIT，约 19k★ | 静态 + Git | 成熟但 UI/配置偏旧 |
| [TinaCMS](https://tina.io) | Apache-2.0，约 14k★ | Git + 云/自托管 | 可视化编辑强，但依赖更重 |
| [Payload](https://payloadcms.com) | MIT，约 45k★ | Next.js + 数据库 | 仪表盘/集合模型优秀，但需要运行时与数据库 |
| [Directus](https://directus.io) | BSL 类许可，约 39k★ | 独立服务 + 数据库 | 数据平台强，不适合静态个人站 |

**结论**：本站是单作者、静态输出、内容以 Git 管理；引入 Payload/Directus 会违背"零运行时后端"约束。采用 **Sveltia 作为编辑内核 + 自建只读仪表盘**，借鉴 Payload/Directus 的统计卡、集合导航与发布状态呈现。

## 2. 仪表盘借鉴

- 统计卡：项目/笔记/草稿/领域/待补链接，对应 Payload 的 dashboard metrics。
- 集合导航：项目、笔记、站点资料、Profile，对应 Directus 的 content collections。
- 发布状态：simple workflow 保存即 commit，Actions 自动部署；仪表盘只链接状态，不注入 token。
- 最近内容表：标题、类型、状态、日期、编辑入口；降低"进入 CMS 后找不到内容"的成本。

## 3. 视觉参考

| 来源 | 借鉴点 | 落地 |
|---|---|---|
| [rauno.me](https://rauno.me) | 强排版、单一视觉符号 | 保持大字号 Hero 与编号母题 |
| [paco.me](https://paco.me) | 文本优先、命令面板 | 已有 ⌘K 命令面板；减少装饰 |
| [leerob.io](https://leerob.io) | 长短 bio、内容分栏 | Hero 长短 bio；About 双栏 |
| [emilkowalski.ski](https://emilkowalski.ski) | 留白与节奏 | 统一 section 间距、减少重复 |
| [brittanychiang.com](https://brittanychiang.com) | 项目视觉呈现 | 项目卡加入现有生成封面；标题旁 GitHub 链接 |
| [jhey.dev](https://jhey.dev) | 个性状态 | 保留本地时间/可用状态，不加重型 3D |

## 4. 决策

1. 不重写 CMS；新增 `/admin/` 仪表盘，编辑器移到 `/admin/cms/`。
2. 站点资料迁移到 JSON，新增 Sveltia `site` file collection；保留 TS 导出，页面不改 import。
3. 项目卡使用现有生成封面；不做伪造截图。
4. 项目 GitHub 链接复用 `links.repo`；公开仓库只能确认 2 个，其余后台待补，前端不伪造。
5. 保持 simple workflow，保存即发布；不启用 editorial，避免单人流程多一步。

## 5. 风险

- Sveltia 仍是 0.x；固定版本 + SRI，升级需回归。
- 仪表盘是公开只读页，不能放敏感数据；写权限仍由 GitHub 登录保护。
- 封面图增加请求量；lazy/固定比例/LQIP，LHCI 复核。
- JSON 迁移由脚本与单测兜底。
