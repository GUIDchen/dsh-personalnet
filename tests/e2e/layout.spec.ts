import { expect, test } from "@playwright/test";

test.describe("布局与主题", () => {
  test("移动端菜单可开合且支持 Esc", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const nav = page.locator("#site-nav");
    await expect(nav).toBeHidden();

    await page.locator("[data-menu-toggle]").click();
    await expect(nav).toBeVisible();
    await expect(page.locator("[data-menu-toggle]")).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
  });

  test("主题三态循环并在刷新后保持", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("[data-theme-toggle]");
    await expect(toggle).toHaveAttribute("data-state", "system");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("data-state", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await toggle.click();
    await expect(toggle).toHaveAttribute("data-state", "system");
  });
});
