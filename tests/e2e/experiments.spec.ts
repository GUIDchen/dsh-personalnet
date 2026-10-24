import { expect, test } from "@playwright/test";

test.describe("实验与时间线", () => {
  test("WebGL 实验页有 canvas 与降级路径", async ({ page }) => {
    await page.goto("/experiments/");
    await expect(page.locator("h1")).toHaveText("场");
    await expect(page.locator("canvas[data-webgl-field]")).toBeVisible();
    await expect(page.locator("body")).toContainText("自定义 shader");
  });

  test("时间线展示 12 个项目与可访问表格", async ({ page }) => {
    await page.goto("/timeline/");
    await expect(page.locator("h1")).toHaveText("时间线");
    await expect(page.locator(".gantt li")).toHaveCount(12);
    await expect(page.locator("details.table-panel")).toContainText("可访问数据表");
    await expect(page.locator("table tbody tr")).toHaveCount(12);
  });

  test("英文实验与时间线", async ({ page }) => {
    await page.goto("/en/experiments/");
    await expect(page.locator("h1")).toHaveText("Field");
    await page.goto("/en/timeline/");
    await expect(page.locator("h1")).toHaveText("Timeline");
    await expect(page.locator(".gantt li")).toHaveCount(12);
  });
});
