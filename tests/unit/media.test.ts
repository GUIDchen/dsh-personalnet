import { describe, expect, it } from "vitest";
import { resolveMediaUrl } from "@/lib/media";

describe("media URL", () => {
  it("handles root base", () => {
    expect(resolveMediaUrl("/media/projects/a.jpg", "/")).toBe("/media/projects/a.jpg");
  });

  it("prefixes project base", () => {
    expect(resolveMediaUrl("/media/projects/a.jpg", "/dsh-personalnet/")).toBe(
      "/dsh-personalnet/media/projects/a.jpg",
    );
  });

  it("does not double prefix", () => {
    expect(resolveMediaUrl("/dsh-personalnet/media/a.jpg", "/dsh-personalnet/")).toBe(
      "/dsh-personalnet/media/a.jpg",
    );
  });

  it("keeps external URLs", () => {
    expect(resolveMediaUrl("https://example.com/a.jpg", "/dsh/")).toBe("https://example.com/a.jpg");
  });
});
