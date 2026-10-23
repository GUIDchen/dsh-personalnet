import { profile } from "@/data/profile";
import { absoluteUrl } from "./seo";
import type { ProjectView } from "./content";

const PERSON_ID = () => `${absoluteUrl("/")}#person`;

/** 全站 Person 结构化数据。 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID(),
    name: profile.name,
    alternateName: profile.nameEn,
    jobTitle: profile.role,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    url: absoluteUrl("/"),
    address: { "@type": "PostalAddress", addressLocality: "兰州", addressCountry: "CN" },
    knowsAbout: ["机器学习", "计算机视觉", "数据分析", "大语言模型", "Python", "嵌入式系统"],
  };
}

/** 站点结构化数据。 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: absoluteUrl("/"),
    inLanguage: "zh-CN",
    author: { "@id": PERSON_ID() },
  };
}

/** 项目详情页结构化数据。 */
export function projectJsonLd(project: ProjectView, path: string) {
  const { data } = project;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: data.title,
    abstract: data.summary,
    author: { "@id": PERSON_ID() },
    dateCreated: data.timeframe.start,
    dateModified: data.timeframe.end ?? data.timeframe.start,
    keywords: data.tags.join(", "),
    url: absoluteUrl(path),
    inLanguage: "zh-CN",
    about: data.stack.join(", "),
  };
}

/** 面包屑结构化数据。 */
/** 笔记详情页结构化数据。 */
export function noteJsonLd(
  note: { id: string; data: { title: string; summary: string; date: string; tags: string[] } },
  path: string,
) {
  const { data } = note;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.summary,
    datePublished: data.date,
    keywords: data.tags.join(", "),
    author: { "@id": PERSON_ID() },
    url: absoluteUrl(path),
    inLanguage: "zh-CN",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
