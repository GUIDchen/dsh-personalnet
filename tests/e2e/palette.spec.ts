import { expect, test } from "@playwright/test";

test.describe("命令面板", () => {
  test("⌘K 打开、过滤并导航", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+k");

    const dialog = page.locator("[data-palette-dialog]");
    await expect(dialog).toBeVisible();
    await expect(page.locator("[data-palette-input]")).toBeFocused();

    await page.locator("[data-palette-input]").fill("笔记");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/notes\/$/);
  });

  test("Esc 关闭，再次打开仍可用", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+k");
    await expect(page.locator("[data-palette-dialog]")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("[data-palette-dialog]")).not.toBeVisible();

    await page.keyboard.press("Meta+k");
    await expect(page.locator("[data-palette-dialog]")).toBeVisible();
  });

  test("主题命令生效且导航后仍可再次打开", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+k");
    await page.locator("[data-palette-input]").fill("主题");
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-palette-dialog]")).not.toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.goto("/projects/");
    await page.keyboard.press("Meta+k");
    await expect(page.locator("[data-palette-dialog]")).toBeVisible();
  });

  test("无匹配命令显示空态", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+k");
    await page.locator("[data-palette-input]").fill("zzzz-nothing");
    await expect(page.locator("[data-palette-empty]")).toBeVisible();
  });
});
