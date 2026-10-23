import { expect, test } from "@playwright/test";

test.describe("内容管理后台", () => {
  test("后台页、配置与索引控制可用", async ({ page }) => {
    await page.route("https://unpkg.com/**", (route) => route.abort());

    const response = await page.goto("/admin/");
    expect(response?.status()).toBe(200);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const script = page.locator('script[src*="@sveltia/cms@"]');
    await expect(script).toHaveAttribute("integrity", /^sha384-/);
    await expect(script).toHaveAttribute("crossorigin", "anonymous");

    const config = await page.request.get("/admin/config.yml");
    expect(config.status()).toBe(200);
    const body = await config.text();
    expect(body).toContain("collections:");
    expect(body).toContain("src/content/projects");
    expect(body).toContain("src/content/notes");

    const sitemap = await page.request.get("/sitemap-0.xml");
    expect(await sitemap.text()).not.toContain("/admin/");
  });

  test("后台不出现在 robots 允许范围", async ({ page }) => {
    const response = await page.request.get("/robots.txt");
    const body = await response.text();
    expect(body).toContain("Disallow: /admin/");
  });
});
