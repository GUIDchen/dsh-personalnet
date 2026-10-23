---
文档编号: 17
标题: 维护手册
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 维护手册

本手册描述 v1.0.0 之后的日常维护：发布、升级、内容运营、质量回归与故障处理。
目标：**任何一次变更都能在 30 分钟内完成验证、发布与回滚**。

## 1. 角色与节奏

| 角色 | 职责 |
|---|---|
| 维护者（陈陇刚） | 内容、发布、依赖升级、故障处理 |
| CI | 执行全部质量门禁，阻断不合格变更 |
| Dependabot | 每周提交依赖升级 PR |

固定节奏：

| 周期 | 事项 |
|---|---|
| 每次变更 | `pnpm ci:verify` + E2E + a11y |
| 每周 | 外部链接检查、Dependabot PR 合并、`pnpm audit` |
| 每月 | 依赖升级窗口、内容盘点、备份确认 |
| 每季度 | Lighthouse 回归、手工可访问性走查、浏览器兼容抽查 |
| 每半年 | 运行时与大版本升级评估（Astro / TypeScript / Node） |

## 2. 版本与发布策略

- 语义化版本：`MAJOR` 破坏性变更、`MINOR` 新功能/新页面、`PATCH` 修复与内容修正。
- 内容更新可不发版，但需在 `CHANGELOG.md` 的 `[Unreleased]` 记录。
- 发布流程：

1. 更新 `CHANGELOG.md`，把 `[Unreleased]` 归档为版本号与日期。
2. 更新 `package.json` 的 `version`（与 tag 一致）。
3. 提交：`chore(release): vX.Y.Z`。
4. 打 tag：`git tag -a vX.Y.Z -m "..."`。
5. push 分支与 tag；`deploy.yml` 自动构建并发布。

## 3. 发布检查清单

### 3.1 合并前

- [ ] `pnpm ci:verify` 全绿（lint/format/check/unit/build/docs/content/contrast/integration/seo/budget）
- [ ] `pnpm test:e2e` 34 项通过
- [ ] `pnpm test:a11y` 9 个页面 0 serious/critical
- [ ] 涉及性能改动时 `pnpm perf` 全绿
- [ ] 新增/修改内容通过 `pnpm test:content`，无敏感信息
- [ ] 文档与 ADR 已同步

### 3.2 发布后 5 分钟

- [ ] 首页、项目库、一个详情页、关于、简历、搜索均 200
- [ ] `/robots.txt` 与 `/sitemap-index.xml` 可访问
- [ ] 浏览器控制台无错误
- [ ] OG 图可访问（随机抽查一个项目）
- [ ] 移动端菜单、主题切换、搜索快捷键正常

### 3.3 发布后 24 小时

- [ ] 托管平台构建/部署状态正常
- [ ] 搜索索引可查询（抽查关键词）
- [ ] 无 404 激增（平台分析或日志）

## 4. 内容运营

### 4.1 新增项目

```bash
pnpm new:project my-project        # 生成草稿骨架
# 编辑 src/content/projects/my-project.mdx
pnpm dev                           # 预览
pnpm test:content                  # 校验
pnpm build && pnpm gen:og          # 重新生成 OG 图与封面
```

发布前把 `draft` 改为 `false`，并确认：

- [ ] `summary` 40–160 字，说清问题、方法与结果
- [ ] 六个 H2 小节齐全
- [ ] 标签在 `src/data/tags.json` 词表内
- [ ] 封面 `alt` 文本准确
- [ ] 无手机号、年龄、籍贯、政治面貌等敏感字段
- [ ] 量化结果有依据，没有编造

### 4.2 内容变更

- 修改项目标题/摘要后必须重新运行 `pnpm gen:og`（OG 图、封面与 LQIP 占位会过期）。
- slug 一旦发布不要修改；如必须修改，需在托管平台配置重定向并在 `CHANGELOG` 说明。
- 删除内容前先确认没有外部引用；必要时保留页面并标注归档。

### 4.3 笔记

- 新建：在 `src/content/notes/` 添加 `<slug>.mdx`，`date` 必须加引号（保留字符串类型）。
- 笔记自动进入列表、首页最近 3 篇、RSS、sitemap 与搜索索引，无需额外注册。
- 笔记使用默认 OG 图；如后续需要独立卡片，扩展 `scripts/generate-og.mjs` 的输入源。
- 修改标题/摘要后重新运行 `pnpm build`（RSS 与列表在构建期生成）。

## 5. 依赖升级

### 5.1 每月流程

```bash
pnpm outdated
pnpm audit
# 升级顺序：工具链（lint/prettier）→ 测试 → Astro 生态 → Tailwind → 其他
pnpm install
pnpm ci:verify
```

- Dependabot 已按 astro 生态与开发依赖分组，优先合并 patch/minor。
- 升级 TypeScript 需先检查 `@astrojs/check` 与 `typescript-eslint` 的 peer 范围（见 ADR 0011）。
- 升级 Astro 主版本必须新增 ADR，并阅读官方升级指南；先在本分支跑全量门禁再合并。
- 任何升级导致 Lighthouse 分数下降 >3 分需在 PR 中说明。

### 5.2 回滚

| 场景 | 操作 |
|---|---|
| 依赖回归 | `git revert` 升级提交，重新部署 |
| 内容错误 | revert 内容提交或修正后重新部署 |
| 构建失败 | 修复后重跑；上一版本仍在线 |
| 平台故障 | 切换到 Cloudflare Pages（同一产物） |

## 6. 质量回归日历

### 6.1 每周

- `pnpm check:links` 检查外部链接（403/405 为警告）。
- 合并 Dependabot PR（CI 全绿后 squash）。
- 查看 CI 与部署状态。

### 6.2 每季度

- `pnpm perf` 跑 4 个关键页，记录 LCP/CLS/TBT 与四项分数。
- 手工可访问性：键盘走查首页、项目库、搜索；VoiceOver 抽查一个详情页；200% 缩放。
- 浏览器抽查：Chrome、Safari、Firefox 最新版 + 移动端 Safari。
- 检查 Search Console / 分析工具（若启用）的抓取与错误。

### 6.3 每半年

- 评估 Astro / TypeScript / Node 主版本升级。
- 审视内容结构：领域是否需要合并/拆分、标签词表是否膨胀。
- 审视依赖许可证（新增依赖必须为宽松许可）。

## 7. 备份与恢复

| 资产 | 备份方式 | 恢复 |
|---|---|---|
| 代码与内容 | Git 仓库 + 本地克隆 | clone / revert |
| 部署产物 | 托管平台保留历史构建 | 平台回滚到上一版本 |
| 域名与 DNS | 注册商账户 + 文档记录 | 重新配置 CNAME/A 记录 |
| 密钥与变量 | 平台 Secrets（不入库） | 重新生成并配置 |
| OG/封面源文件 | 仓库内 `public/og` 与 `src/assets/covers` | 重新运行 `pnpm gen:og` |

建议每季度做一次"裸克隆恢复演练"：`git clone` → `pnpm install` → `pnpm build`。

## 8. 监控与告警

| 项 | 方式 |
|---|---|
| CI / 部署失败 | GitHub Actions 通知（邮件） |
| 站点可用性 | 托管平台状态页；可选 UptimeRobot 免费监控 |
| 性能回归 | LHCI 报告作为 CI artifact 保留 7 天 |
| 依赖漏洞 | Dependabot + `pnpm audit` |
| 搜索可用性 | 发布后抽查；索引缺失时页面有降级提示 |

## 9. 故障处理

### 9.1 页面 404

1. 确认最新部署 commit 与构建状态。
2. 本地 `pnpm build && pnpm preview` 复现。
3. 检查 `BASE_PATH` 与链接拼接。
4. 必要时回滚。

### 9.2 搜索无结果

1. 访问 `/pagefind/pagefind.js` 是否 200。
2. 检查构建日志 `[pagefind] Pagefind indexed N pages`。
3. 子路径部署时确认 `BASE_PATH`。
4. 索引异常时搜索页会提示降级，不影响内容阅读。

### 9.3 OG 图缺失

1. 检查 `public/og/<slug>.jpg` 是否存在。
2. `pnpm build && pnpm gen:og` 重新生成。
3. `pnpm test:content` 会校验每个项目的 OG 文件。

### 9.4 性能下降

1. 对比 LHCI artifact 的指标变化。
2. 检查新增依赖、图片、字体与脚本。
3. `pnpm check:budget` 定位体积增长来源。

### 9.5 回滚部署

1. `git revert <commit>` 并 push，触发重新构建。
2. 或在托管平台选择上一成功构建重新发布。
3. 回滚后重复 §3.2 的检查。

## 10. 分析与隐私

- 默认不加载任何分析脚本。
- 如需启用 Umami：设置 `PUBLIC_ANALYTICS_ID`，在 CSP 中加入域名，并在 `docs/12` 记录数据范围。
- 不接入广告、指纹或跨站追踪；启用前先更新隐私说明。

## 11. 升级与演进路线

| 事项 | 触发条件 | 参考 |
|---|---|---|
| Astro 主版本 | 官方发布且生态跟进 | 新增 ADR，按升级指南执行 |
| TypeScript 7 | `@astrojs/check` 与 typescript-eslint 支持 | ADR 0011 |
| Sveltia CMS | 需要浏览器编辑 | ADR 0012 |
| 英文版 | 内容准备就绪 | ADR 0006 |
| notes 集合 | 有稳定写作节奏 | 在 `content.config.ts` 新增集合 |

## 12. 维护记录模板

```markdown
### YYYY-MM-DD 维护记录

- 类型：内容 / 依赖 / 修复 / 性能
- 变更：
- 验证：ci / e2e / a11y / perf
- 结果与后续：
```
