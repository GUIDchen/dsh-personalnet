import { expect, test } from "@playwright/test";

test.describe("GitHub 项目索引", () => {
  test("展示 14 个公开仓库并链接到 GitHub", async ({ page }) => {
    const response = await page.goto("/github/");
    expect(response?.status()).toBe(200);
    const cards = page.locator(".repo-card");
    await expect(cards).toHaveCount(14);
    const first = cards.first();
    await expect(first).toHaveAttribute("href", /^https:\/\/github\.com\/GUIDchen\//);
    await expect(first).toHaveAttribute("target", "_blank");
    await expect(first).toHaveAttribute("rel", /noopener/);
    await expect(page.locator(".repo-card a")).toHaveCount(0);
  });

  test("英文页使用英文摘要", async ({ page }) => {
    await page.goto("/en/github/");
    await expect(page.locator("h1")).toHaveText("GitHub projects");
    await expect(page.locator(".repo-card").first()).toContainText("YOLO video/webcam detection");
  });

  test("页脚与后台可进入 GitHub 项目", async ({ page }) => {
    await page.goto("/");
    await page.locator('footer a[href="/github/"]').click();
    await expect(page).toHaveURL(/\/github\/$/);
    await page.goto("/admin/");
    await expect(page.locator('a[href="/github/"]').first()).toBeVisible();
    await expect(page.locator("body")).toContainText("GitHub 项目源");
  });
});
