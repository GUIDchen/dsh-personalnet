---
文档编号: 14
标题: 内容迁移（从简历到站点）
状态: Draft
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 内容迁移

> 来源：本机 `dsh-jianli/resume-pro/content.py`（只读参考，不复制其代码与排版）。迁移只取**事实**，重写为案例研究语体。

## 1. 可用素材

| 类别 | 内容 |
|---|---|
| 基本信息 | 姓名、邮箱、学历（硕士/本科）、专业、院校 |
| 科研项目 | 国家自然科学基金 72364033、甘肃省科技计划 23JRZA397、校重大科研项目、多项横向合作 |
| 实践经历 | 独立开发/自主就业、企业软硬件与数据分析、教室设备与网络运维 |
| 技能 | Python/C/C++/Java/SQL、PyTorch/TensorFlow/PaddlePaddle、OpenCV/YOLO、SPSS/Stata、Linux/Docker/Git、Verilog/CUDA |
| 奖项 | 校三好学生、奖学金 |
| 证书 | CET-4、C1、教师资格证（数学） |

## 2. 项目映射（12 个）

| # | slug | 标题 | 领域 | 素材要点 | 需你确认 |
|---|---|---|---|---|---|
| 1 | `poverty-relapse-model` | 返贫监测与治理决策模型 | research | 国自然 72364033；数据采集清洗、分类预测与聚类、个体识别 | 可公开的指标与产出 |
| 2 | `multimodal-medical-diagnosis` | 多模态医疗数据与智能辅助诊断 | computer-vision | 医学影像与文本预处理、特征提取、流程搭建 | 项目边界与角色 |
| 3 | `medical-knowledge-graph` | 医学病症知识图谱构建 | ai-llm | 医学文本信息抽取、节点与关系设计 | 是否含医院数据 |
| 4 | `mobile-banking-analytics` | 手机银行用户行为大数据分析平台 | data-analytics | 行为数据采集清洗、统计分析、业务决策支持 | 客户名称是否可提 |
| 5 | `qingyang-east-data-west` | 庆阳"东数西算"投入产出分析 | data-analytics | 成本数据整理、成本估算模型、报告撰写 | 报告是否可公开 |
| 6 | `yolo-object-detection` | YOLO 目标检测工程实践 | computer-vision | 标注、划分、增强、训练调参、评估可视化 | 数据集来源 |
| 7 | `llm-transformer-finetune` | Transformer/Llama 预训练与微调实验 | ai-llm | 预训练/微调、超参对比、RAG 了解 | 可公开的实验结论 |
| 8 | `smart-home-light` | 智能家居灯控系统 | embedded-systems | 网页端与单片机联动、灯光控制 | 是否保留为案例 |
| 9 | `javaweb-blog` | 基于 JavaWeb 的个人博客系统 | web-engineering | 需求、数据库设计、前后端、测试与文档 | 是否附论文/截图 |
| 10 | `cuda-ai-operator` | CUDA 并行计算与 AI 算子实践 | infrastructure | CUDA 并行、算子优化练习 | 练习性质说明 |
| 11 | `verilog-fpga-practice` | Verilog/SystemVerilog 与 FPGA 实践 | embedded-systems | HDL、UVM、FPGA 流程 | 练习性质说明 |
| 12 | `agri-bank-platform` | "田园生活"农商精准对接大数据平台 | data-analytics | 农商数据采集整合、平台研发（20 万横向） | 平台细节可公开范围 |

## 3. 迁移步骤

1. **脱敏**：删除手机号、年龄、籍贯、政治面貌；确认客户/医院名称是否可公开。
2. **改写**：每个项目按六段式写作；把"参与"与"独立完成"如实标注，不夸大。
3. **可视化**：准备封面与 1–3 张示意图；无法提供时用设计占位。
4. **链接**：补充仓库/论文/演示（如无可留空）。
5. **校验**：`pnpm test:content` + `pnpm check:privacy`。
6. **评审**：逐条对照本表确认事实。

## 4. 不迁移的内容

| 内容 | 原因 |
|---|---|
| 手机号 | 隐私 |
| 年龄、籍贯、政治面貌 | 隐私且与站点目标无关 |
| 身份证等证件 | 高危 |
| 未公开的横向项目细节 | 商业保密 |
| 简历中的岗位名称变体 | 站点以"项目"而非"岗位"组织 |

## 5. 迁移检查表

- [ ] 12 个项目 slug 与表格一致
- [ ] 每个项目 domain 正确、标签在词表内
- [ ] 每个项目有封面（或确认使用占位）
- [ ] 每个项目有 alt 文本
- [ ] 无手机号/敏感字段
- [ ] summary 长度 40–160 字
- [ ] 结果部分有可验证描述
- [ ] `CHANGELOG.md` 记录内容新增

## 6. 待你确认的问题（发布前）

1. 邮箱是否直接公开，还是换成联系表单？
2. 是否使用真人头像？默认用字母标识。
3. 科研项目的量化结果哪些可以公开？
4. 企业/医院/银行相关项目是否匿名化？
5. 是否保留 2019 年的嵌入式与 JavaWeb 项目？