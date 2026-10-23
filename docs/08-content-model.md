---
文档编号: 08
标题: 内容模型与写作规范
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 内容模型与写作规范

## 1. 内容集合

| 集合 | 目录 | 格式 | 用途 |
|---|---|---|---|
| `projects` | `src/content/projects/` | MDX | 项目案例（12 个） |
| `notes`（预留） | `src/content/notes/` | MDX | 技术笔记（M7） |
| `pages`（预留） | `src/content/pages/` | MDX | 长文页面（M7） |

## 2. projects schema

| 字段 | 类型 | 必填 | 约束 | 说明 |
|---|---|---|---|---|
| `title` | string | 是 | 2–40 字 | 页面 H1 |
| `summary` | string | 是 | 40–160 字 | 卡片摘要与 meta description |
| `domain` | enum | 是 | 7 个领域之一 | 一级分类 |
| `tags` | string[] | 是 | 1–6 个，来自词表 | 二级标签 |
| `role` | string | 是 | ≤40 字 | 角色，如"独立开发" |
| `team` | string | 否 | ≤60 字 | 团队/项目来源 |
| `timeframe.start` | string | 是 | `YYYY.MM` | 开始时间 |
| `timeframe.end` | string | 否 | `YYYY.MM` | 结束时间 |
| `timeframe.ongoing` | boolean | 否 | 默认 false | 是否进行中 |
| `status` | enum | 是 | active/completed/archived/experimental | 项目状态 |
| `featured` | boolean | 否 | 默认 false | 是否首页精选 |
| `order` | number | 否 | 默认 999 | 排序权重（小在前） |
| `cover.src` | string | 否 | 相对 `src/assets` | 封面图 |
| `cover.alt` | string | 条件必填 | 有 src 时必填 | 替代文本 |
| `gallery` | array | 否 | ≤6 项 | 图库 |
| `stack` | string[] | 是 | 1–12 个 | 技术栈 |
| `links.repo` | url | 否 | https | 仓库 |
| `links.demo` | url | 否 | https | 演示 |
| `links.paper` | url | 否 | https | 论文/报告 |
| `metrics` | array | 否 | ≤4 项 | 指标（label/value/unit） |
| `highlights` | string[] | 否 | ≤4 条 | 关键成果，≤40 字/条 |
| `draft` | boolean | 否 | 默认 false | 草稿不参与构建 |
| `seo.title` | string | 否 | ≤60 字 | 覆盖默认 title |
| `seo.description` | string | 否 | ≤160 字 | 覆盖默认 description |

## 3. frontmatter 示例

```yaml
---
title: YOLO 目标检测工程实践
summary: 从数据标注、增强到训练调参与评估，搭建一套可复用的目标检测流程，并完成结果可视化。
domain: computer-vision
tags: [yolo, opencv, dataset]
role: 独立实践
timeframe: { start: "2023.09", end: "2024.01", ongoing: false }
status: completed
featured: true
order: 1
cover:
  src: projects/yolo-cover.png
  alt: YOLO 检测结果示例：街景中标注的车辆与行人
stack: [Python, PyTorch, YOLO, OpenCV]
metrics:
  - { label: 数据规模, value: "3,000+", unit: 张 }
  - { label: 迭代轮次, value: "40+", unit: 次 }
links:
  repo: https://github.com/example/yolo-practice
draft: false
---
```

## 4. 领域词表

| id | 中文名 | 说明 |
|---|---|---|
| `ai-llm` | 大模型 / NLP | 预训练、微调、RAG、知识图谱 |
| `computer-vision` | 计算机视觉 | 检测、识别、图像处理、多模态 |
| `data-analytics` | 数据分析 | 清洗、建模、可视化、决策支持 |
| `embedded-systems` | 嵌入式 / 端侧 | 单片机、Verilog/FPGA、端侧推理 |
| `infrastructure` | 基础设施 / 运维 | Linux、部署、GPU、性能 |
| `web-engineering` | Web 工程 | 前后端、交互、平台 |
| `research` | 科研项目 | 基金项目、论文、研究报告 |

新增领域需同时更新 `src/data/domains.ts`、本表与设计系统点缀色。

## 5. 标签词表（节选）

- 算法：`classification`、`clustering`、`detection`、`segmentation`、`rag`、`finetune`
- 工程：`automation`、`cli`、`api`、`deployment`、`performance`
- 数据：`cleaning`、`visualization`、`etl`
- 硬件：`mcu`、`fpga`、`cuda`
- 其他：`opencv`、`pytorch`、`knowledge-graph`

标签全小写、短横线分隔、单数。新增标签需在 `src/data/tags.ts` 登记，构建时校验。

## 6. 正文结构（六段式）

```markdown
## 背景与问题
## 约束
## 方案与架构
## 关键决策
## 结果与度量
## 反思
```

写作要求：

- 每段 2–5 个自然段；关键决策用「问题 → 选项 → 选择 → 代价」结构。
- 结果优先给可验证指标；没有数据时写清验证方式，不编造数字。
- 反思必须包含"如果重做会怎么改"。
- 不写公司内部敏感信息、客户名称（除非公开）。

## 7. 图片规范

| 类型 | 尺寸 | 格式 | 体积 |
|---|---|---|---|
| 封面 | 1600×1000（16:10） | PNG/WebP 源，输出 AVIF/WebP | ≤150KB（输出） |
| 图库 | 长边 ≤2000 | 同上 | ≤200KB |
| 图标 | 24×24 viewBox | SVG | ≤4KB |

- 图片放 `src/assets/`，通过 `astro:assets` 引用，禁止直接引用 `public/` 大图。
- 必须提供有意义的中文 `alt`，装饰图用 `alt=""`。
- 文件名：`<slug>-<序号>-<含义>.png`。

## 8. 校验规则与报错

| 规则 | 失败行为 | 提示 |
|---|---|---|
| 必填缺失 | 构建失败 | `projects/<file>.mdx: 字段 title 缺失` |
| domain 非法 | 构建失败 | 列出合法枚举 |
| summary 长度 | 构建失败 | 当前长度 + 目标区间 |
| cover.alt 缺失 | 构建失败 | 指向字段路径 |
| 未知 tag | 构建警告（CI 失败） | 建议相近标签 |
| slug 重复 | 构建失败 | 列出冲突文件 |
| 草稿 | 跳过构建 | 日志提示 |

## 9. 内容工作流

1. `pnpm new:project <slug>` 生成草稿骨架（`draft: true`，不会进入构建）。
2. 填写 frontmatter 与正文，补封面（可选）。
3. `pnpm dev` 预览；`pnpm test:content` 校验（草稿跳过 OG 与小节检查）。
4. `pnpm build && pnpm gen:og` 重新生成 OG 图与封面；把 `draft` 改为 `false`。
5. 提交 PR；CI 通过后合并，自动部署。
6. `CHANGELOG.md` 记录新增项目。

## 10. 内容清单（与 14 号文档对应）

12 个项目的 slug、标题、领域、来源映射见 `14-content-migration.md` 表格。