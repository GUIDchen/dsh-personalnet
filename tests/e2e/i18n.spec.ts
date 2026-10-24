import { expect, test } from "@playwright/test";

test.describe("中英文界面", () => {
  test("中文首页切换到英文", async ({ page }) => {
    await page.goto("/");
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText("Chen Longgang");
    await expect(page.locator("nav[aria-label='Main navigation']")).toBeVisible();
  });

  test("英文页切回中文", async ({ page }) => {
    await page.goto("/en/");
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(page.locator("h1")).toContainText("陈陇刚");
  });

  test("hreflang 与 canonical 成对出现", async ({ page }) => {
    await page.goto("/en/");
    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("hreflang")));
    expect(alternates).toEqual(expect.arrayContaining(["zh-CN", "en", "x-default"]));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/$/);
  });

  test("英文项目页链接到英文详情", async ({ page }) => {
    await page.goto("/en/projects/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const firstCard = page.locator(".project-card .title-link").first();
    await expect(firstCard).toHaveAttribute("href", /^\/en\/projects\//);
    await expect(firstCard).toContainText("YOLO Object Detection in Practice");
    await page.goto("/en/notes/");
    await expect(page.locator(".notes")).toContainText("A Media Workflow for a Static Site");
    const noteLink = page.locator(".notes a").first();
    await expect(noteLink).toHaveAttribute("href", /^\/en\/notes\//);
  });

  test("英文详情正文与 hreflang", async ({ page }) => {
    await page.goto("/en/projects/yolo-object-detection/");
    await expect(page.locator("h1")).toHaveText("YOLO Object Detection in Practice");
    await expect(page.locator("body")).toContainText("Background and problem");
    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("hreflang")));
    expect(alternates).toEqual(expect.arrayContaining(["zh-CN", "en", "x-default"]));
    await page.goto("/en/notes/why-astro-7/");
    await expect(page.locator("h1")).toHaveText("Why This Site Uses Astro 7");
    await expect(page.locator("body")).toContainText("Requirements");
    await expect(page.locator(".takeaways")).toContainText("Key takeaways");
  });

  test("中文详情页的语言切换保持同一 slug", async ({ page }) => {
    await page.goto("/projects/yolo-object-detection/");
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(/\/en\/projects\/yolo-object-detection\/$/);
  });

  test("英文命令面板使用英文文案", async ({ page }) => {
    await page.goto("/en/");
    await page.keyboard.press("Meta+k");
    await expect(page.locator("[data-palette-dialog]")).toBeVisible();
    await expect(page.locator("[data-palette-input]")).toHaveAttribute(
      "placeholder",
      "Type a command or page name…",
    );
    await page.locator("[data-palette-input]").fill("Notes");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/en\/notes\/$/);
  });

  test("英文搜索页使用英文状态文案", async ({ page }) => {
    await page.goto("/en/search/");
    await expect(page.locator("h1")).toHaveText("Search");
    await expect(page.locator("[data-search-status]")).toHaveText("Type a keyword to start");
  });

  test("英文 Now / Uses 与页脚链接可用", async ({ page }) => {
    await page.goto("/en/");
    await page.locator('footer a[href="/en/now/"]').click();
    await expect(page).toHaveURL(/\/en\/now\/$/);
    await expect(page.locator("h1")).toHaveText("What I'm doing now");

    await page.goto("/en/uses/");
    await expect(page.locator("h1")).toHaveText("Tools I use");
    await expect(page.locator("body")).toContainText("Astro 7");
  });

  test("404 页语言切换保持可用", async ({ page }) => {
    await page.goto("/404.html");
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(/\/en\/404\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.locator(".lang-switch").click();
    await expect(page).toHaveURL(/\/404\.html$/);
  });
});
