import { expect, test } from "@playwright/test";

test.describe("OG 图与社交元数据", () => {
  test("每个项目都有可访问的 OG 图", async ({ page, request }) => {
    await page.goto("/projects/yolo-object-detection/");
    const content = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(content).toContain("/og/yolo-object-detection.jpg");

    const response = await request.get("/og/yolo-object-detection.jpg");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/jpeg");
    const buffer = await response.body();
    expect(buffer[0]).toBe(0xff);
    expect(buffer[1]).toBe(0xd8);
  });

  test("首页使用默认 OG 图", async ({ page }) => {
    await page.goto("/");
    const content = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(content).toContain("/og/default.jpg");
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200",
    );
  });
});
