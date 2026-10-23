import { expect, test } from "@playwright/test";

test.describe("Now / Uses", () => {
  test("现在页展示三组状态", async ({ page }) => {
    await page.goto("/now/");
    await expect(page.locator("h1")).toHaveText("现在在做什么");
    await expect(page.locator("section")).toHaveCount(3);
    await expect(page.locator("body")).toContainText("在学");
  });

  test("工具页展示技术栈分组", async ({ page }) => {
    await page.goto("/uses/");
    await expect(page.locator("h1")).toHaveText("常用工具");
    await expect(page.locator("section")).toHaveCount(5);
    await expect(page.locator("body")).toContainText("Astro 7");
  });

  test("页脚与首页可进入 Now / Uses", async ({ page }) => {
    await page.goto("/");
    await page.locator('footer a[href="/now/"]').click();
    await expect(page).toHaveURL(/\/now\/$/);

    await page.goto("/");
    await page.locator('footer a[href="/uses/"]').click();
    await expect(page).toHaveURL(/\/uses\/$/);
  });

  test("关于页保留技能与经历", async ({ page }) => {
    await page.goto("/about/");
    await expect(page.locator("#skills-title")).toBeVisible();
    await expect(page.locator("#timeline-title")).toBeVisible();
  });
});
