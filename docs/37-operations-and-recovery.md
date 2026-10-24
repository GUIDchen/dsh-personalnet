---
文档编号: 37
标题: 运维连续性与灾难恢复
状态: Approved
最后更新: 2026-10-24
维护者: 陈陇刚
---

# 运维连续性与灾难恢复

本文补充 11（部署）与 17（维护）的连续性视角：备份、恢复、密钥轮换、事故分级与演练。目标是个人站可维护、可回滚、可迁移。

## 1. 拓扑

~~~mermaid
flowchart LR
  Dev[本地/Git] --> GH[GitHub main]
  GH --> CI[CI 验证]
  CI --> Pages[GitHub Pages]
  GH --> CFW[Cloudflare 自动部署]
  CFW --> CF[Cloudflare Pages]
  CF --> Edge[全球边缘]
  Pages --> Edge
  Edge --> User[访客]
~~~

- 主源：GitHub 仓库（唯一事实源）。
- 构建产物：dist（可再生，不作为备份）。
- 媒体/内容：仓库内 public/media 与 src/content。
- 双站：GitHub Pages 子路径 + Cloudflare 根路径；可独立回滚。
- 后台：Sveltia → GitHub Contents API；无自建数据库。

## 2. 备份与恢复目标

| 对象 | 备份 | RPO | RTO | 恢复 |
|---|---|---|---|---|
| 代码/内容 | GitHub + 本地克隆 | 0（已提交） | 10 分钟 | clone/checkout |
| 媒体 | Git 历史 | 0（已提交） | 15 分钟 | checkout 文件 |
| 部署产物 | 可再生 | 不适用 | 10 分钟 | 重新构建/部署 |
| DNS/托管配置 | 文档 11/33 | 不适用 | 30 分钟 | 控制台重建 |
| Secrets | GitHub Secrets（不可读回） | 不适用 | 30 分钟 | 重新创建/更新 |

RPO 仅覆盖已提交内容；未提交的本地编辑不在保护范围。

## 3. 备份检查

- 每周确认 main 可 clone、构建通过。
- 每月确认 release tag 与 GitHub/Cloudflare 部署可对应。
- 每季度做一次“从 tag 重新构建 + 部署到预览”的恢复演练。
- 媒体上传后确认已提交；后台保存后确认 commit 出现在 GitHub。

## 4. 恢复流程

### 4.1 代码/内容回滚

1. 确认问题提交与最后可用 tag。
2. 优先 revert 问题提交；必要时 checkout 旧 tag 构建。
3. 运行 ci:verify；部署预览验证。
4. 合并/部署；记录维护日志。

### 4.2 站点不可用

1. 检查 GitHub Pages/Cloudflare 状态与最近 deploy。
2. 回滚到上一成功部署或重新触发 deploy。
3. 若一侧故障，另一侧继续服务；确认 canonical/链接仍可用。
4. 发布后检查 200、CSP、搜索、admin。

### 4.3 仓库丢失/账号不可用

1. 使用本地克隆或镜像恢复仓库。
2. 重建远端、Pages/Cloudflare 项目与 Secrets。
3. 从 tag 重新构建；验证双站。
4. 更新 DNS/文档。

## 5. 密钥与 Token 轮换

### 5.1 Cloudflare API Token

1. Cloudflare → My Profile → API Tokens → 撤销旧 token。
2. 新建最小权限 token：Account Cloudflare Pages Edit、Account Settings Read。
3. 更新 GitHub Secret CLOUDFLARE_API_TOKEN。
4. 手动运行 deploy-cloudflare-pages；确认 success。
5. 记录轮换日期，不记录 token 值。

### 5.2 GitHub Token（Sveltia）

- fine-grained token，仅目标仓库 Contents Read/Write。
- 泄露立即撤销；后台重新登录。
- 不把 token 写入 localStorage 之外的仓库/截图/日志。

## 6. 事故分级与响应

| 级别 | 示例 | 响应 | 目标 |
|---|---|---|---|
| SEV-1 | 全站不可用、密钥泄露、恶意内容 | 立即回滚/撤销，30 分钟内恢复或降级 | RTO 30 分钟 |
| SEV-2 | 关键页面 404、部署连续失败、CSP 阻断 | 2 小时内处理 | 当日恢复 |
| SEV-3 | 单页样式/内容问题、搜索异常 | 1–3 个工作日 | 下个发布 |
| SEV-4 | 建议/优化 | Backlog | 排期 |

事故记录：时间线、影响、根因、处置、行动项、负责人。安全问题优先于内容发布。

## 7. 监控与告警

- GitHub Actions 失败通知；部署 workflow 结果。
- 健康报告（15 项）与维护日志。
- 公网检查：首页、项目、英文详情、feed、admin、CSP 头。
- 无外部 APM/分析；以构建期与部署后检查为主。

## 8. 维护窗口与支持

- 个人项目，尽力而为；无 24×7 SLA。
- 计划内升级选择低流量时段；升级前打 tag/记录回滚点。
- 安全报告按 SECURITY.md 私下处理，7 天确认、30 天修复或说明。

## 9. 演练清单

- [ ] 从 tag 重建并本地预览
- [ ] 回滚一次部署
- [ ] 轮换一个测试 token（不生产）
- [ ] 验证双站 200 与 CSP
- [ ] 记录 RTO 实际耗时
