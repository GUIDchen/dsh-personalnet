import { expect, test } from "@playwright/test";

test.describe("内容管理后台", () => {
  test("仪表盘统计与入口", async ({ page }) => {
    await page.route("https://api.github.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          workflow_runs: [
            {
              status: "completed",
              conclusion: "success",
              created_at: new Date().toISOString(),
              html_url: "https://github.com/GUIDchen/dsh-personalnet/actions",
            },
          ],
        }),
      }),
    );
    const response = await page.goto("/admin/");
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveText("内容管理");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('a[href="/admin/cms/"]').first()).toBeVisible();
    await expect(page.locator("body")).toContainText("项目");
    await expect(page.locator("body")).toContainText("笔记");
    await expect(page.locator("body")).toContainText("证据完整度");
    await expect(page.locator("body")).toContainText("内容证据");
    await expect(page.locator("body")).toContainText("发布流程");
    await expect(page.locator("[data-deploy-status]")).toContainText("成功");
  });

  test("CMS 页面、配置与索引控制可用", async ({ page }) => {
    await page.route("https://unpkg.com/**", (route) => route.abort());

    const response = await page.goto("/admin/cms/");
    expect(response?.status()).toBe(200);

    const script = page.locator('script[src*="@sveltia/cms@"]');
    await expect(script).toHaveAttribute("integrity", /^sha384-/);
    await expect(script).toHaveAttribute("crossorigin", "anonymous");

    const config = await page.request.get("/admin/cms/config.yml");
    expect(config.status()).toBe(200);
    const body = await config.text();
    expect(body).toContain("collections:");
    expect(body).toContain("src/content/projects");
    expect(body).toContain("src/content/notes");
    expect(body).toContain("src/data/profile.zh.json");
    expect(body).toContain("publish_mode: simple");

    const sitemap = await page.request.get("/sitemap-0.xml");
    expect(await sitemap.text()).not.toContain("/admin/");
  });

  test("CMS 配置包含图片上传目录", async ({ page }) => {
    const response = await page.request.get("/admin/cms/config.yml");
    const body = await response.text();
    expect(body).toContain("media_folder: public/media/projects");
    expect(body).toContain("public_folder: /media/projects");
    expect(body).toContain("widget: image");
  });

  test("后台不出现在 robots 允许范围", async ({ page }) => {
    const response = await page.request.get("/robots.txt");
    const body = await response.text();
    expect(body).toContain("Disallow: /admin/");
  });
});
