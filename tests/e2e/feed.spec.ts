import { expect, test } from "@playwright/test";

test.describe("JSON Feed", () => {
  test("feed 结构与条目", async ({ request }) => {
    const response = await request.get("/feed.json");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/application\/(feed\+)?json/);
    const body = await response.json();
    expect(body.version).toBe("https://jsonfeed.org/version/1.1");
    expect(body.items.length).toBe(18);
    expect(body.items.some((item: { url: string }) => item.url.includes("/notes/"))).toBe(true);
  });

  test("feed 同时包含项目与笔记", async ({ request }) => {
    const response = await request.get("/feed.json");
    const body = await response.json();
    expect(body.items.some((item: { _type: string }) => item._type === "project")).toBe(true);
    expect(body.items.some((item: { _type: string }) => item._type === "note")).toBe(true);
    expect(body.items.some((item: { url: string }) => item.url.includes("/admin/"))).toBe(false);
  });

  test("feed 使用 UTF-8 且条目有 url", async ({ request }) => {
    const response = await request.get("/feed.json");
    const text = await response.text();
    expect(text).toContain("陈陇刚");
    const body = JSON.parse(text);
    expect(body.items.every((item: { url: string }) => item.url.startsWith("http"))).toBe(true);
  });

  test("页面 head 声明 feed", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="alternate"][type="application/feed+json"]')).toHaveCount(
      1,
    );
  });
});
