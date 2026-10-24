import { describe, expect, it } from "vitest";
import { getCanvasSize, getDpr } from "@/scripts/experiment-field";

describe("experiment field sizing", () => {
  it("clamps DPR to 1–2", () => {
    expect(getDpr(0)).toBe(1);
    expect(getDpr(1)).toBe(1);
    expect(getDpr(2)).toBe(2);
    expect(getDpr(3)).toBe(2);
  });

  it("keeps backing-store dimensions integral and non-zero", () => {
    expect(getCanvasSize(100.4, 50.2, 2)).toEqual({ width: 200, height: 100 });
    expect(getCanvasSize(0, 0, 1)).toEqual({ width: 1, height: 1 });
  });
});
