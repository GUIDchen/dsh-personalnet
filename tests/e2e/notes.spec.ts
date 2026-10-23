import { expect, test } from "@playwright/test";

test.describe("技术笔记", () => {
  test("列表展示全部已发布笔记", async ({ page }) => {
    await page.goto("/notes/");
    await expect(page.locator("h1")).toHaveText("笔记");
    await expect(page.locator(".notes li")).toHaveCount(6);
    await expect(page.locator(".notes")).toContainText("给静态站点加一个媒体工作流");
  });

  test("详情渲染 TOC 与结构化数据", async ({ page }) => {
    await page.goto("/notes/why-astro-7/");
    await expect(page.locator("h1")).toHaveText("为什么这个站点选择 Astro 7");

    const toc = page.locator(".toc a");
    await expect(toc.first()).toBeVisible();
    expect(await toc.count()).toBeGreaterThanOrEqual(3);

    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? "{}")["@type"]),
      );
    expect(types).toContain("BlogPosting");
    expect(types).toContain("BreadcrumbList");
  });

  test("导航与首页入口可达", async ({ page }) => {
    await page.goto("/");
    await page.locator('#site-nav a[href="/notes/"]').click();
    await expect(page).toHaveURL(/\/notes\/$/);
    await expect(page.locator("h1")).toHaveText("笔记");

    await page.goto("/");
    const latest = page.locator('section[aria-labelledby="notes-title"] a[href^="/notes/"]');
    await expect(latest).toHaveCount(4);
  });

  test("搜索可以命中笔记", async ({ page }) => {
    await page.goto("/search/");
    await page.locator("[data-search-input]").fill("Pagefind");
    const results = page.locator("[data-search-results] li");
    await expect(results.first()).toBeVisible({ timeout: 15_000 });
    const links = await page
      .locator("[data-search-results] a")
      .evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    expect(links.some((href) => href?.includes("/notes/"))).toBe(true);
  });

  test("RSS 同时包含项目与笔记", async ({ request }) => {
    const response = await request.get("/rss.xml");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect((text.match(/<item>/g) ?? []).length).toBe(18);
    expect(text).toContain("/notes/quality-gates-in-ci/");
    expect(text).toContain("/projects/yolo-object-detection/");
  });

  test("详情页使用 LQIP 占位", async ({ page }) => {
    await page.goto("/notes/why-astro-7/");
    await page.goto("/projects/yolo-object-detection/");
    const style = await page.locator("figure.cover").getAttribute("style");
    expect(style).toContain("data:image/webp;base64");
  });
});
