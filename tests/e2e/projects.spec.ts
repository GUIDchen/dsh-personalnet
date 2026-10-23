import { expect, test } from "@playwright/test";

test.describe("项目库筛选与排序", () => {
  test("领域筛选、计数与 URL 同步", async ({ page }) => {
    await page.goto("/projects/");
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(12);

    await page.locator('[data-filter-domain="data-analytics"]').click();
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(3);
    await expect(page).toHaveURL(/\?domain=data-analytics/);
    await expect(page.locator("[data-visible-count]")).toHaveText("3");
    await expect(page.locator('[data-filter-domain="data-analytics"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("标签多选与无结果状态", async ({ page }) => {
    await page.goto("/projects/");
    await page.locator('[data-filter-domain="data-analytics"]').click();
    await page.locator('[data-filter-tag="etl"]').click();
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(2);

    await page.locator('[data-filter-domain="computer-vision"]').click();
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(0);
    await expect(page.locator("[data-empty-state]")).toBeVisible();

    await page.locator("[data-empty-state] [data-clear-filters]").click();
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(12);
  });

  test("排序改变顺序并写入 URL", async ({ page }) => {
    await page.goto("/projects/");
    await page.locator("[data-sort]").selectOption("title");
    await expect(page).toHaveURL(/sort=title/);

    const domTitles = await page
      .locator("[data-project-item] .project-card .title")
      .allTextContents();
    const expected = await page.evaluate(() => {
      const titles = [...document.querySelectorAll("[data-project-item]")].map(
        (item) => item.querySelector(".title")?.textContent ?? "",
      );
      return [...titles].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
    });
    expect(domTitles).toEqual(expected);
  });

  test("刷新后从 URL 还原筛选状态", async ({ page }) => {
    await page.goto("/projects/?domain=data-analytics&tag=etl&sort=latest");
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(2);
    await expect(page.locator("[data-sort]")).toHaveValue("latest");
    await expect(page.locator('[data-filter-domain="data-analytics"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator('[data-filter-tag="etl"]')).toHaveAttribute("aria-pressed", "true");
  });

  test("无 JavaScript 时展示全部项目", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/projects/");
    await expect(page.locator("[data-project-item]")).toHaveCount(12);
    await expect(page.locator("[data-filter-bar]")).toBeHidden();
    await context.close();
  });
});

test.describe("项目详情", () => {
  test("TOC、结构化数据与面包屑", async ({ page }) => {
    await page.goto("/projects/yolo-object-detection/");
    const toc = page.locator(".toc a");
    await expect(toc).toHaveCount(6);
    const hrefs = await toc.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    for (const href of hrefs) expect(href?.startsWith("#")).toBeTruthy();

    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? "{}")["@type"]),
      );
    expect(types).toContain("CreativeWork");
    expect(types).toContain("BreadcrumbList");
  });
});

test.describe("机器可读输出", () => {
  test("RSS 与 projects.json", async ({ request }) => {
    const rss = await request.get("/rss.xml");
    expect(rss.ok()).toBeTruthy();
    const rssText = await rss.text();
    expect((rssText.match(/<item>/g) ?? []).length).toBe(12);

    const json = await request.get("/projects.json");
    expect(json.ok()).toBeTruthy();
    const payload = await json.json();
    expect(payload.count).toBe(12);
    expect(payload.projects).toHaveLength(12);
  });
});
