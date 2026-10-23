import { expect, test } from "@playwright/test";

test.describe("维护能力", () => {
  test("简历页可打印并隐藏站点外壳", async ({ page }) => {
    await page.addInitScript(() => {
      const state = window as unknown as { __printed: boolean };
      state.__printed = false;
      window.print = () => {
        state.__printed = true;
      };
    });

    await page.goto("/cv/");
    await expect(page.locator("h1")).toHaveText("陈陇刚");
    await expect(page.locator("[data-print]")).toBeVisible();

    await page.locator("[data-print]").click();
    expect(await page.evaluate(() => (window as unknown as { __printed: boolean }).__printed)).toBe(
      true,
    );

    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".site-footer")).toBeHidden();
    await expect(page.locator("[data-cv-actions]")).toBeHidden();
  });

  test("robots.txt 声明 sitemap 并禁止搜索页", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("Disallow: /search/");
    expect(text).toMatch(/Sitemap: https?:\/\/.+sitemap-index\.xml/);
  });

  test("关于页提供简历入口", async ({ page }) => {
    await page.goto("/about/");
    const link = page.locator('a[href="/cv/"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/cv\/$/);
  });
});
