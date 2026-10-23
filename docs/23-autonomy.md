---
文档编号: 23
标题: 自动审阅与长跑维护
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 自动审阅与长跑维护

> 目标：让站点在没有人盯着的时期也能发现回归、记录健康状态，并由 Agent 在受控范围内持续完善。分为"定时审计"和"会话内长跑"两层。

## 1. 两层机制

| 层 | 触发 | 能力 | 边界 |
|---|---|---|---|
| GitHub Actions | 每周一 02:00 UTC + 手动 | 构建、内容/SEO/产物/后台/对比度/预算/链接检查，生成报告并维护 Issue | 只读仓库，不自动提交 |
| Agent 长跑（DSH goal） | 每轮会话 | 审阅报告与 Backlog、实现、测试、本地 commit、写日志 | 不 push、不自动合并、不碰密钥 |

两者互补：Actions 负责"持续发现"，Agent 负责"持续修复"。

## 2. 定时审计

- 工作流：`.github/workflows/maintenance.yml`
- 脚本：`scripts/health-report.mjs`（先 `pnpm build`，再运行 `pnpm health`）
- 输出：`reports/health.md`（gitignored），并上传为 Actions artifact
- 汇总：查找带 `maintenance` 标签且含标记的 open Issue，存在则更新，不存在则创建；检查失败时 job 最终为失败
- 报告包含：生成时间、分支、commit、Node 版本、每项检查结果与耗时、失败项、每项最后 80 行输出；检查含内容模型、站点资料、媒体、内容证据、SEO、产物、后台、对比度、预算与外部链接（10 项）。

手动触发：Actions → maintenance → Run workflow；本地等价命令：

~~~bash
pnpm build
pnpm health
~~~

## 3. Agent 长跑契约

目标在会话中创建，`max_goal_rounds` 默认 30。每轮按顺序：

1. 读当前目标、`docs/13` Backlog、`reports/health.md` 与 `docs/24-maintenance-log.md`。
2. 跑最小可信检查（lint / check / unit / build；涉及页面时再跑 E2E、a11y、SEO、预算）。
3. 选择一个最小可验收项；优先 P0/P1，不并发铺开多个方向。
4. 实现 + 测试 + 文档；必要时补 ADR/CHANGELOG。
5. 本地 commit（不 push）。
6. 在 `docs/24-maintenance-log.md` 追加本轮记录（commit、变更、验证、遗留）。
7. 若需要用户输入（远程仓库、OAuth、真实截图、翻译、视觉方向），记录并跳过，不阻塞其他工作。

### 允许

- 代码、样式、测试、脚本、文档、配置
- 内容事实修正（只改有证据的部分）
- 依赖升级建议与 Dependabot PR 审阅
- 生成式封面/OG 重跑

### 禁止

- 删除真实项目/笔记内容
- 自动合并或强制推送
- 写入 token、密钥、个人敏感信息
- 伪造截图、指标、外部链接
- 未经确认改变个人身份信息或视觉方向
- 在没有测试的情况下大规模重构

### 停止条件

- 目标内全部里程碑完成
- 连续 2 轮没有安全可做的项
- 需要用户提供远程仓库、域名、OAuth 或内容素材
- 检查连续失败且无法在单轮内定位

## 4. 自动修复边界

| 类型 | 处理 |
|---|---|
| 依赖升级 | Dependabot 开 PR；Agent 审阅 CI 后合并建议，不自动合并 |
| 格式/lint | `pnpm lint:fix` / `pnpm format` 本地修复并测试 |
| 失效内部链接 | Agent 修复并跑 `check:links` |
| 内容/翻译/视觉 | 需要用户确认，不自动改 |
| 安全漏洞 | 记录 Issue，优先升级；不自动降级或绕过 |

## 5. 运行记录

- 每轮追加到 [24-maintenance-log.md](./24-maintenance-log.md)。
- Actions 的 Issue 是外部可见的健康历史；日志是内部决策历史。
- 报告与日志都不应包含 token、邮箱明文以外的隐私数据。

## 6. 失败处理

1. 先看 `reports/health.md` 的失败项与最后 80 行输出。
2. 能本地复现的，按"失败测试 → 最小修复 → 回归"处理。
3. 外部链接/网络抖动：403/405 与网络错误降级为警告；404/410/5xx 仍为失败。
4. 定时任务本身失败：检查 workflow 权限、Node/pnpm 版本、Issue 标签是否存在。
5. 连续失败：暂停自动修改，先修基础设施。
