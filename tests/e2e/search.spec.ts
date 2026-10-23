import { expect, test } from "@playwright/test";

test.describe("全站搜索", () => {
  test("关键词返回结果并可进入详情", async ({ page }) => {
    await page.goto("/search/");
    await page.locator("[data-search-input]").fill("YOLO");

    const results = page.locator("[data-search-results] li");
    await expect(results.first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("[data-search-status]")).toContainText("找到");
    await expect(page.locator("[data-search-results] a").first()).toContainText("YOLO");

    await page.locator("[data-search-results] a").first().click();
    await expect(page).toHaveURL(/projects\/yolo-object-detection/);
    await expect(page.locator("h1")).toContainText("YOLO");
  });

  test("无结果时展示空态", async ({ page }) => {
    await page.goto("/search/");
    await page.locator("[data-search-input]").fill("zzzz-nothing-matches");
    await expect(page.locator("[data-search-empty]")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("[data-search-status]")).toContainText("没有找到");
  });

  test("⌘K 打开命令面板并进入搜索", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+k");
    await expect(page.locator("[data-palette-dialog]")).toBeVisible();

    await page.locator("[data-palette-input]").fill("搜索");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/search\/\?focus=1/);
    await expect(page.locator("[data-search-input]")).toBeFocused();
  });
});
