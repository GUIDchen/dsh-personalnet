import { expect, test } from "@playwright/test";

test.describe("安全模型", () => {
  test("安全页与 security.txt 可用", async ({ page, request }) => {
    const response = await page.goto("/security/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("安全");
    await expect(page.locator("body")).toContainText("静态边界");
    await expect(page.locator("body")).toContainText("编辑器鉴权");
    await expect(page.locator("body")).toContainText("已知限制");

    const txt = await request.get("/.well-known/security.txt");
    expect(txt.status()).toBe(200);
    const body = await txt.text();
    expect(body).toContain("Contact:");
    expect(body).toContain("Canonical:");
  });

  test("英文安全页与页脚入口", async ({ page }) => {
    await page.goto("/en/security/");
    await expect(page.locator("h1")).toHaveText("Security");
    await expect(page.locator("body")).toContainText("Static boundary");
    await page.goto("/");
    await expect(page.locator('footer a[href="/security/"]')).toBeVisible();
  });
});
