import { expect, test } from "@playwright/test";

test.describe("订阅说明", () => {
  test("说明页保留 RSS/JSON Feed 原始地址", async ({ page }) => {
    const response = await page.goto("/feed/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("订阅");
    await expect(page.locator('a[href="/rss.xml"]')).toBeVisible();
    await expect(page.locator('a[href="/feed.json"]')).toBeVisible();
    await expect(page.locator("body")).toContainText("直接打开 XML");
  });

  test("页脚 RSS 入口指向说明页", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/feed/"]')).toBeVisible();
    await page.locator('footer a[href="/feed/"]').click();
    await expect(page).toHaveURL(/\/feed\/$/);
  });

  test("英文说明页", async ({ page }) => {
    await page.goto("/en/feed/");
    await expect(page.locator("h1")).toHaveText("Subscribe");
    await expect(page.locator('a[href="/rss.xml"]')).toBeVisible();
  });
});
