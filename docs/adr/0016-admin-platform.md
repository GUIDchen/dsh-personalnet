---
adr: 0016
标题: Sveltia 编辑内核 + 静态管理仪表盘
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0016：Sveltia 编辑内核 + 静态管理仪表盘

## 背景

站点已有 Sveltia CMS，可编辑项目/笔记并直接提交；但入口只有登录页，站点资料仍在 TS/i18n 中，缺少内容概览与发布可见性。

## 决策

- 保留 Sveltia 作为唯一写入编辑器，路径迁到 `/admin/cms/`。
- 新增 `/admin/` 静态仪表盘，构建期读取内容统计与最近条目；只读、noindex。
- 站点资料迁移到 `src/data/*.json`，通过 `site` file collection 编辑；TS wrapper 保持页面 import 不变。
- 保持 simple workflow：保存即 commit，Actions 自动部署；不引入数据库或自建认证。

## 后果

### 正面

- 不增加运行时与运维；写权限仍由 GitHub 保护。
- 管理入口、内容范围与发布流程更清晰。
- JSON 可校验、可 diff，CMS 与站点共用一份数据。

### 负面

- 仪表盘与 CMS 两套界面，需要保持一致。
- 公开只读仪表盘不能视为安全边界；敏感数据不得放入。
- JSON 迁移增加一次性改动量，需要 `check-site-data` 与单测兜底。
