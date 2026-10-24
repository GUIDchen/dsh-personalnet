import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

export const DOMAINS = [
  "ai-llm",
  "computer-vision",
  "data-analytics",
  "embedded-systems",
  "infrastructure",
  "web-engineering",
  "research",
] as const;

const timeframe = z.object({
  start: z.string().regex(/^\d{4}\.\d{2}$/, "格式应为 YYYY.MM"),
  end: z
    .string()
    .regex(/^\d{4}\.\d{2}$/, "格式应为 YYYY.MM")
    .optional(),
  ongoing: z.boolean().default(false),
});

const link = z.url();

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(2).max(40),
    titleEn: z.string().min(2).max(80).optional(),
    summary: z.string().min(20).max(200),
    summaryEn: z.string().min(20).max(240).optional(),
    domain: z.enum(DOMAINS),
    tags: z
      .array(z.string().regex(/^[a-z0-9-]+$/))
      .min(1)
      .max(6),
    role: z.string().max(40),
    roleEn: z.string().max(80).optional(),
    team: z.string().max(60).optional(),
    teamEn: z.string().max(100).optional(),
    timeframe,
    status: z.enum(["active", "completed", "archived", "experimental"]),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    cover: z
      .object({
        src: z.string(),
        alt: z.string().min(1, "封面必须提供 alt"),
      })
      .optional(),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string().min(1) }))
      .max(6)
      .default([]),
    stack: z.array(z.string()).min(1).max(12),
    links: z
      .object({
        repo: link.optional(),
        demo: link.optional(),
        paper: link.optional(),
        doc: link.optional(),
      })
      .default({}),
    repoVisibility: z.enum(["public", "private", "none"]).optional(),
    metrics: z
      .array(z.object({ label: z.string(), value: z.string(), unit: z.string().optional() }))
      .max(4)
      .default([]),
    highlights: z.array(z.string().max(80)).max(4).default([]),
    highlightsEn: z.array(z.string().max(120)).max(4).optional(),
    metricsEn: z
      .array(z.object({ label: z.string(), value: z.string(), unit: z.string().optional() }))
      .max(4)
      .optional(),
    draft: z.boolean().default(false),
    seo: z
      .object({
        title: z.string().max(60).optional(),
        description: z.string().max(160).optional(),
        titleEn: z.string().max(60).optional(),
        descriptionEn: z.string().max(160).optional(),
        ogImage: z.string().optional(),
      })
      .optional(),
  }),
});

const noteDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "格式应为 YYYY-MM-DD")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
  }, "日期无效");

const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string().min(2).max(60),
    titleEn: z.string().min(2).max(80).optional(),
    summary: z.string().min(20).max(200),
    summaryEn: z.string().min(20).max(240).optional(),
    takeaways: z.array(z.string().min(4).max(80)).max(4).optional(),
    takeawaysEn: z.array(z.string().min(4).max(120)).max(4).optional(),
    date: noteDate,
    tags: z
      .array(z.string().regex(/^[a-z0-9-]+$/))
      .max(6)
      .default([]),
    seo: z
      .object({
        title: z.string().max(60).optional(),
        description: z.string().max(160).optional(),
        titleEn: z.string().max(60).optional(),
        descriptionEn: z.string().max(160).optional(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const projectBodiesEn = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/projects-en" }),
  schema: z.object({
    title: z.string().min(2).max(120),
    draft: z.boolean().default(false),
  }),
});

const noteBodiesEn = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/notes-en" }),
  schema: z.object({
    title: z.string().min(2).max(120),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  projects,
  notes,
  "projects-en": projectBodiesEn,
  "notes-en": noteBodiesEn,
};
