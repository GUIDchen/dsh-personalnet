---
adr: 0021
标题: Cloudflare 使用 CSP 响应头，GitHub Pages 保留 meta CSP
状态: Accepted
日期: 2026-10-24
决策者: 陈陇刚
---

# ADR 0021：Cloudflare CSP 响应头策略

## 背景

GitHub Pages 不支持自定义响应头；Cloudflare Pages 支持 _headers。admin 需要 unpkg/api.github.com，public 需要更严格。

## 决策

- Cloudflare /* 输出 admin 兼容的 CSP 超集（self/inline/wasm + unpkg + api.github.com），并加 HSTS/COOP/frame-ancestors。
- public 页面继续使用更严格的 meta CSP；header 与 meta 取交集。
- admin meta 与 header 同时允许所需来源。
- GitHub Pages 只保留 meta CSP，并在文档中说明限制。

## 后果

优点：Cloudflare 有真正 frame-ancestors/HSTS；admin 不被误伤。
代价：两套策略需同时维护；新增第三方资源需同时检查 header/meta。
