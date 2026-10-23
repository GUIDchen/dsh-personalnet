---
adr: 0012
标题: 无运行时后端；可选 Git-based CMS
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0012：无运行时后端；可选 Git-based CMS

## 状态

Accepted（2026-10-23）

## 背景

内容更新频率低（月级），单作者，无用户生成内容；引入后端会带来运维、安全与成本负担。

## 决策驱动因素

- 零运维
- 内容版本可追溯
- 未来可平滑增强编辑体验

## 考虑过的选项

- **纯 Git（MDX + PR）**：零运维，适合开发者
- **Sveltia CMS（Git-based）**：浏览器编辑，直接提交到仓库，MIT
- **Decap CMS**：成熟但历史包袱重
- **Payload 3 / Strapi / Directus**：完整 CMS，需要运行时与数据库

## 决策

本期采用纯 Git 工作流；若需要可视化编辑，优先评估 Sveltia CMS（不改变静态架构）；只有在出现多用户/工作流需求时才评估 Payload 独立后台。

## 后果

### 正面

- 架构最简，攻击面最小
- 内容与代码同版本，回滚一致

### 负面

- 非技术用户体验一般
- 无实时协作与草稿审批流

### 后续行动

- M7 评估 Sveltia；若接入，补充认证、CSP 与编辑指南。

## 相关

- [03-research-landscape.md](../03-research-landscape.md)
- [13-roadmap-and-backlog.md](../13-roadmap-and-backlog.md)
