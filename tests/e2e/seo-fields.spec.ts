import { expect, test } from "@playwright/test";

test.describe("英文 SEO 字段", () => {
  test("长标题使用 seo.titleEn，不依赖 slug 特判", async ({ page }) => {
    await page.goto("/en/projects/multimodal-medical-diagnosis/");
    await expect(page).toHaveTitle(/Multimodal Medical Diagnosis/);
    await expect(page.locator("h1")).toContainText(
      "Multimodal Medical Data and AI-Assisted Diagnosis",
    );

    await page.goto("/en/projects/qingyang-east-data-west/");
    await expect(page).toHaveTitle(/Qingyang East Data West Cost Analysis/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Cost structure/,
    );
  });

  test("英文笔记长标题使用 seo.titleEn", async ({ page }) => {
    await page.goto("/en/notes/pagefind-static-search/");
    await expect(page).toHaveTitle(/Pagefind for a Static Site/);
    await expect(page.locator("h1")).toContainText("Full-text Search for a Static Site");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Build-time full-text search/,
    );
  });
});
