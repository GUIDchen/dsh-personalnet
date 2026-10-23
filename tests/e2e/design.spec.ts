import { expect, test } from "@playwright/test";

test.describe("项目封面与 GitHub 链接", () => {
  test("项目库每张卡片有封面且标题可进入详情", async ({ page }) => {
    await page.goto("/projects/");
    const cards = page.locator("[data-project-card]");
    await expect(cards).toHaveCount(12);
    await expect(page.locator("[data-project-card] .cover img")).toHaveCount(12);
    await expect(page.locator("[data-project-card] a a")).toHaveCount(0);

    await cards.first().locator(".title-link").click();
    await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
  });

  test("已配置的项目显示 GitHub 源码链接", async ({ page }) => {
    await page.goto("/projects/");
    const repos = page.locator("[data-project-card] .repo-link");
    await expect(repos).toHaveCount(2);
    await expect(repos.first()).toHaveAttribute("href", /^https:\/\/github\.com\/GUIDchen\//);
    await expect(repos.first()).toHaveAttribute("target", "_blank");
    await expect(repos.first()).toHaveAttribute("rel", /noopener/);
  });

  test("详情页标题旁显示源码链接", async ({ page }) => {
    await page.goto("/projects/javaweb-blog/");
    const repo = page.locator(".title-actions .repo-link");
    await expect(repo).toHaveAttribute("href", "https://github.com/GUIDchen/javaee-blog");
    await expect(repo).toHaveAttribute("aria-label", /GitHub/);
  });
});
