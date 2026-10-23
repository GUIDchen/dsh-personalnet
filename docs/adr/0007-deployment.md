---
adr: 0007
标题: GitHub Pages 主、Cloudflare Pages 备的静态部署
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0007：GitHub Pages 主、Cloudflare Pages 备的静态部署

## 状态

Accepted（2026-10-23）

## 背景

站点为纯静态产物，需要免费、可靠、可回滚的托管，并支持自定义域名与子路径部署。

## 决策驱动因素

- $0 成本
- 与 Git 工作流集成
- 支持自定义域名与 HTTPS
- 可回滚

## 考虑过的选项

- **GitHub Pages + Actions**：免费、与仓库同源、原子发布
- **Cloudflare Pages**：CDN 优秀、支持 headers/redirects
- **Vercel**：体验好，但免费层条款与区域访问存在不确定性
- **Netlify**：成熟，但免费额度与构建分钟限制

## 决策

默认 GitHub Pages（Actions 构建并部署）；同时提供 Cloudflare Pages 配置（同一产物），通过 `SITE_URL`/`BASE_PATH` 适配根域与子路径。

## 后果

### 正面

- 零成本、零服务器
- 部署与代码同仓，审计简单

### 负面

- GitHub Pages 不能自定义响应头（CSP 用 meta 标签）
- 子路径需正确配置 base

### 后续行动

- CI 中增加 `BASE_PATH=/dsh-personalnet/` 构建验证；Cloudflare 配置写入部署文档。

## 相关

- [11-deployment-operations.md](../11-deployment-operations.md)
