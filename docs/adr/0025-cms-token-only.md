---
adr: 0025
标题: CMS 保持细粒度 token-only 登录
状态: Accepted
日期: 2026-10-24
决策者: 陈陇刚
---

# ADR 0025：CMS 保持 token-only

## 背景

Sveltia CMS 支持 OAuth 与 fine-grained token。OAuth 需要 GitHub OAuth App、Cloudflare Worker 代理与额外 Secrets；当前站点是单人维护的静态站，后台使用频率低。

## 决策

- 继续使用 fine-grained token，仅授予目标仓库 Contents Read/Write。
- 不部署 OAuth Worker，不在客户端引入 OAuth 凭据。
- 在 docs/22、docs/37 记录启用 OAuth 的前置条件与轮换步骤。
- 未来若有多人或移动端强需求，再新增 ADR 与独立实施计划。

## 理由

- 攻击面更小：没有额外 OAuth 代理与回调端点。
- 维护成本更低：不增加 Worker、OAuth App 与 Secret 轮换。
- 当前规模足够：单人、低频、可随时撤销 token。

## 后果

### 正面

- 不增加运行时服务与第三方依赖。
- token 权限最小化，泄露可快速撤销。
- 与静态优先原则一致。

### 负面

- 登录体验不如 OAuth 一键登录。
- token 需要手动创建/轮换；不能多人协作。
- 这不是“未完成”，而是明确接受的产品/运维决策。

## 后续

若启用 OAuth，需要：GitHub OAuth App、Cloudflare Workers Scripts 权限、Worker 部署与回调域名；单独评审。
