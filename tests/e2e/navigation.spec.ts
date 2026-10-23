import { expect, test } from "@playwright/test";

test.describe("视图过渡与状态保持", () => {
  test("客户端导航后主题与菜单仍可用", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // 先切到深色主题
    await page.locator("[data-theme-toggle]").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // 打开移动菜单并导航到项目页
    await page.locator("[data-menu-toggle]").click();
    await expect(page.locator("#site-nav")).toBeVisible();
    await page.locator('#site-nav a[href="/projects/"]').click();
    await expect(page).toHaveURL(/projects\/$/);
    await expect(page.locator("h1")).toHaveText("项目");

    // 客户端导航不应产生新的 document 导航
    const navigationEntries = await page.evaluate(
      () => performance.getEntriesByType("navigation").length,
    );
    expect(navigationEntries).toBe(1);

    // 主题保持，菜单脚本在导航后仍可初始化
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.locator("[data-menu-toggle]").click();
    await expect(page.locator("#site-nav")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-nav")).toBeHidden();
  });

  test("项目页筛选在客户端导航后仍工作", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/projects/"]').first().click();
    await expect(page.locator("h1")).toHaveText("项目");

    await page.locator('[data-filter-domain="data-analytics"]').click();
    await expect(page.locator("[data-project-item]:visible")).toHaveCount(3);

    await page.goBack();
    await expect(page.locator("h1")).toContainText("陈陇刚");
  });
});
