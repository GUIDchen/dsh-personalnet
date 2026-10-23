import { DOMAINS } from "@/content.config";

export interface DomainMeta {
  id: (typeof DOMAINS)[number];
  label: string;
  description: string;
}

export const DOMAIN_META: Record<DomainMeta["id"], DomainMeta> = {
  "ai-llm": { id: "ai-llm", label: "大模型 / NLP", description: "预训练、微调、RAG 与知识组织" },
  "computer-vision": {
    id: "computer-vision",
    label: "计算机视觉",
    description: "检测、识别、图像处理与多模态",
  },
  "data-analytics": {
    id: "data-analytics",
    label: "数据分析",
    description: "采集清洗、统计建模与决策支持",
  },
  "embedded-systems": {
    id: "embedded-systems",
    label: "嵌入式 / 端侧",
    description: "单片机、HDL 与端侧推理",
  },
  infrastructure: {
    id: "infrastructure",
    label: "基础设施 / 运维",
    description: "Linux、部署、GPU 与性能",
  },
  "web-engineering": {
    id: "web-engineering",
    label: "Web 工程",
    description: "前后端、交互与平台",
  },
  research: { id: "research", label: "科研项目", description: "基金项目、方法与研究报告" },
};

export const DOMAIN_LIST = DOMAINS.map((id) => DOMAIN_META[id]);
