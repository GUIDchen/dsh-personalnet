import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", name: "首页" },
  { path: "/projects/", name: "项目库" },
  { path: "/projects/yolo-object-detection/", name: "项目详情" },
  { path: "/about/", name: "关于" },
  { path: "/notes/", name: "笔记列表" },
  { path: "/notes/why-astro-7/", name: "笔记详情" },
  { path: "/now/", name: "现在" },
  { path: "/uses/", name: "工具" },
  { path: "/cv/", name: "简历" },
  { path: "/search/", name: "搜索" },
  { path: "/en/", name: "English home" },
  { path: "/en/projects/", name: "English projects" },
  { path: "/en/about/", name: "English about" },
  { path: "/en/cv/", name: "English CV" },
  { path: "/en/now/", name: "English Now" },
  { path: "/en/uses/", name: "English Uses" },
  { path: "/github/", name: "GitHub 项目" },
  { path: "/en/github/", name: "English GitHub" },
  { path: "/security/", name: "安全" },
  { path: "/en/security/", name: "English security" },
  { path: "/feed/", name: "订阅" },
  { path: "/en/feed/", name: "English subscribe" },
  { path: "/experiments/", name: "实验" },
  { path: "/en/experiments/", name: "English experiments" },
  { path: "/timeline/", name: "时间线" },
  { path: "/en/timeline/", name: "English timeline" },
  { path: "/en/projects/yolo-object-detection/", name: "English project detail" },
  { path: "/en/notes/why-astro-7/", name: "English note detail" },
  { path: "/admin/", name: "管理后台" },
  { path: "/404.html", name: "404" },
];

for (const pageInfo of pages) {
  test(`${pageInfo.name} 无严重可访问性问题`, async ({ page }) => {
    await page.goto(pageInfo.path, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const blocking = results.violations
      .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
      .map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => node.target.join(" ")),
      }));

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}
