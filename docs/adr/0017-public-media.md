---
adr: 0017
标题: public/media 作为 CMS 图片存储
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0017：public/media 作为 CMS 图片存储

## 背景

项目需要真实截图/图库，但现有图片在 `src/assets`，由 `astro:assets` 构建期优化；Sveltia 的 image widget 需要可写的媒体目录与可预览的 public 路径。两者路径语义不同。

## 决策

- CMS 图片写入 `public/media/projects/`，frontmatter 保存 `/media/projects/...`。
- 前端通过 `ProjectMedia` 解析 base 并输出 `<img>`；不强制经过 `astro:assets`。
- 无真实封面时继续使用 `src/assets/covers` 的生成封面。
- 用 `check-media` 限制 300KB/文件、8MB 总量，配合 lazy 与固定比例控制性能。

## 后果

### 正面

- 后台可上传、预览、保存；路径简单，静态托管可直接服务。
- 不需要构建期图片管线或外部存储。
- 与现有生成封面兼容。

### 负面

- public 图片没有 AVIF/WebP 多尺寸优化；大图会影响性能，需要作者控制体积。
- 线上 CMS 在项目子路径下预览 `/media` 可能 404；本地编辑为推荐方式。
- 未来图片量大时需要 Sharp 变体管线或外部存储。
