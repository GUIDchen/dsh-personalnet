#!/usr/bin/env node
/**
 * 静态站并发探测：对公开 URL 发少量并发请求，输出 p50/p95/max 与状态分布。
 * 不进入 CI；用于迁移前后对比，避免对平台造成压力。
 *
 * 用法：node scripts/load-test.mjs [url] [requests] [concurrency]
 */
const url = process.argv[2] || "https://guidchen.github.io/dsh-personalnet/";
const total = Number(process.argv[3] || 40);
const concurrency = Number(process.argv[4] || 10);
const latencies = [];
const statuses = new Map();
let index = 0;

async function worker() {
  while (index < total) {
    index++;
    const started = performance.now();
    try {
      const response = await fetch(url, { cache: "no-store" });
      statuses.set(response.status, (statuses.get(response.status) ?? 0) + 1);
      await response.arrayBuffer();
    } catch {
      statuses.set(0, (statuses.get(0) ?? 0) + 1);
    }
    latencies.push(performance.now() - started);
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, total) }, worker));
latencies.sort((a, b) => a - b);
const pct = (q) => latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * q))] ?? 0;
const failures = [...statuses.entries()].filter(([status]) => status < 200 || status >= 400);
console.log("并发探测");
console.log("  URL: " + url);
console.log("  请求: " + total + "，并发: " + concurrency);
console.log("  p50: " + pct(0.5).toFixed(0) + "ms");
console.log("  p95: " + pct(0.95).toFixed(0) + "ms");
console.log("  max: " + (latencies.at(-1) ?? 0).toFixed(0) + "ms");
console.log(
  "  状态: " + [...statuses.entries()].map(([status, count]) => status + "×" + count).join(", "),
);
if (failures.length > 0) process.exit(1);
