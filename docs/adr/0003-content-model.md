---
adr: 0003
标题: Content Collections + Zod + MDX 作为内容模型
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0003：Content Collections + Zod + MDX 作为内容模型

## 状态

Accepted（2026-10-23）

## 背景

12 个跨领域项目需要统一的结构化元数据与长文正文，且必须防止字段缺失或非法值上线。

## 决策驱动因素

- 构建期校验，失败即阻断
- 类型推导到页面与 lib
- 支持富文本与嵌入组件
- 新增项目只需一个文件

## 考虑过的选项

- **Content Collections（glob loader）+ Zod + MDX**：官方方案，类型安全，支持 MDX
- **文件系统读取 + 手写校验**：灵活但重复劳动多
- **Headless CMS（Payload/Strapi）**：可视化编辑，但引入运行时与运维
- **JSON/YAML 数据源**：结构强但正文写作体验差

## 决策

使用 `src/content.config.ts` 定义 projects 集合，glob loader 加载 `src/content/projects/*.mdx`，Zod schema 强制约束；正文用 MDX，仅允许 GFM 与自定义 Astro 组件。

## 后果

### 正面

- 字段级报错，内容质量前移
- 类型自动推导，减少手写接口
- MDX 支持图表与 API 组件

### 负面

- MDX 允许执行代码，需限制可用组件
- Zod 错误信息对非技术作者不够友好

### 后续行动

- 为常见错误补充中文提示；内容 lint 脚本检查 summary 长度与 alt 文本。

## 相关

- [08-content-model.md](../08-content-model.md)
- [02-requirements.md](../02-requirements.md)
