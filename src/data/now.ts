export interface NowSection {
  title: string;
  items: string[];
}

export const NOW = {
  updated: "2026-10",
  intro: "这一页记录我现在把时间花在哪里。比简历更即时，比项目页更个人；会随手更新。",
  sections: [
    {
      title: "在做",
      items: [
        "独立开发 AI 数据处理应用：采集、清洗、训练、评估与部署。",
        "维护本站：Astro 静态站、内容模型、质量门禁与文档。",
        "整理 12 个项目案例，把问题、约束、方案与结果写成可复用的材料。",
      ],
    },
    {
      title: "在学",
      items: [
        "嵌入式方向：Verilog / SystemVerilog 与 FPGA 开发流程。",
        "CUDA 并行计算与 AI 算子优化。",
        "大模型微调与检索增强（RAG）的工程化落地。",
      ],
    },
    {
      title: "在找",
      items: [
        "人工智能、数据分析或软件工程方向的合作与工作机会。",
        "欢迎邮件交流：项目、数据、模型或工程实践都可以。",
      ],
    },
  ] satisfies NowSection[],
} as const;
