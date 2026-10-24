---
文档编号: 31
标题: 独立网站部署方案调研（待审阅）
状态: Draft
最后更新: 2026-10-24
维护者: 陈陇刚
---

# 独立网站部署方案调研（待审阅）

> 本文只做调研，不执行迁移、不购买服务器、不修改 DNS。价格与额度核对于 2026-10-24，官方可能调整；以链接页面为准。

## 1. 结论先行

对当前这个纯静态个人站：

1. **继续 GitHub Pages 是成本最低、运维最少的方案**：0 美元、无服务器、已有 CI/CD、别人可直接访问。
2. 如果需要自定义响应头、重定向、预览部署或中国访问优化，优先评估 **Cloudflare Pages**，仍是 0 服务器。
3. **不建议为了个人展示站租 VPS 或自建服务器**：省下的托管费会变成补丁、备份、监控、TLS 与可用性的时间成本。
4. 自定义域名是唯一建议的付费项：约 10–15 美元/年；不改变托管方案。
5. 中国大陆服务器需要 ICP 备案与域名实名；香港/海外服务器免备案但访问路径不稳定，需要实测。

## 2. 方案分类

### A. 不采用服务器（静态托管 / Serverless 静态）

| 方案 | 免费额度（约） | 付费 | 直接访问 | 适合 |
|---|---|---|---|---|
| GitHub Pages（当前） | 1 GB 站点、100 GB/月软带宽、Actions 构建不限 10 次/小时 | 公共仓库免费 | 是，HTTPS 自定义域名 | 开源个人站、零运维 |
| Cloudflare Pages | 500 次构建/月、静态请求免费且不限量、全球 CDN | Workers 付费按需 | 是，支持 headers/redirects | 需要响应头、边缘缓存、预览 |
| Netlify | Free 约 300 credits/月；Personal 约 9 美元/月 | 按 credits | 是 | 表单、函数、预览 |
| Vercel | Hobby 免费（个人非商业） | Pro 约 20 美元/人/月 | 是 | Next.js/函数；纯静态偏重 |
| Cloudflare R2 + CDN/Workers | 10 GB 存储/月、出口流量免费、100 万 Class A/1000 万 Class B | 存储 0.015 美元/GB-月 | 是，需自建路由/域名 | 图片/大文件、对象存储 |
| GitLab Pages / Codeberg Pages | 免费 | 免费 | 是 | Git 生态替代 |

**共同点**：不需要自己维护操作系统；TLS 由平台提供；公开页面天然可被任何人访问；没有登录/数据库。

### B. 租用服务器（VPS / 云主机）

| 方案 | 参考价格 | 说明 |
|---|---|---|
| Hetzner Cloud CX22 | 约 3.8–5.6 欧元/月 | 欧洲性价比高，需自己运维 |
| DigitalOcean Basic | 约 4–6 美元/月起 | 文档成熟，备份/快照另计 |
| Vultr / Linode 入门 | 约 5–6 美元/月起 | 多地区可选 |
| 阿里云/腾讯云轻量（大陆） | 约 50–200 元/月起 | 需 ICP 备案、域名实名 |
| 香港/新加坡 VPS | 约 5–15 美元/月起 | 免备案，大陆访问路径不稳定 |

**固定成本**：VPS + 域名 + 备份/快照 + 监控（可用免费层），TLS 用 Let's Encrypt/Caddy 免费。
**隐性成本**：系统补丁、防火墙、SSH 加固、日志、证书续期、故障恢复、DDoS 防护、合规。

### C. 自建服务器（家宽 / NAS / 迷你主机）

| 项 | 参考成本 |
|---|---|
| 迷你主机/树莓派/NAS | 1000–3000 元一次性 |
| 电费 | 约 50–150 元/年（低功耗） |
| 域名 | 10–15 美元/年 |
| 公网 IP | 家宽通常无固定公网 IPv4；CGNAT 需隧道 |
| Cloudflare Tunnel | 免费（需 Cloudflare 账号与域名） |
| UPS/备份 | 可选，300–1000 元 |

**优点**：完全控制、可跑内网服务、学习价值高。
**缺点**：家宽上传带宽、断电、硬盘故障、IP 变化、安全暴露面、需要长期维护。
**不建议**把个人展示站作为第一套自建生产环境；可作为实验或内网服务。

## 3. 成本对比（个人站，年）

| 方案 | 现金成本/年 | 时间成本 | 可用性/运维 |
|---|---|---|---|
| GitHub Pages + 无域名 | 0 | 低 | 平台 SLA，公开可访问 |
| GitHub Pages + 自定义域名 | 约 70–110 元 | 低 | 同上，品牌更好 |
| Cloudflare Pages + 域名 | 约 70–110 元 | 低 | 全球 CDN，支持 headers |
| Netlify Personal + 域名 | 约 700–900 元 | 低 | 表单/函数/预览 |
| VPS + 域名 | 约 400–900 元 | 中高 | 需补丁/备份/监控 |
| 自建 + 域名 | 硬件 1000–3000 元 + 电费 | 高 | 依赖家庭网络与硬件 |
| 大陆云主机 + 备案 | 约 600–2400 元 + 备案时间 | 中高 | 大陆访问快，合规要求高 |

> 以上为量级估算，不含 CDN 超额、对象存储、邮件、监控等可选费用。

## 4. 直接访问与域名

任何人访问公开站点只需要：

1. 一个公开 URL（平台子域或自定义域名）；
2. DNS 解析（CNAME/A/AAAA 或平台托管）；
3. 有效 TLS 证书（平台自动或 Let's Encrypt）；
4. 页面不设置访问控制。

当前站点是公开静态站：访客无需登录；只有 /admin/cms/ 的写操作需要 GitHub token。自定义域名不会改变这一点。

### 自定义域名的通用步骤（未来执行）

1. 购买域名（Cloudflare Registrar、Namecheap、阿里云等）。
2. 在托管平台添加 custom domain。
3. 按平台要求配置 CNAME/A 记录，等待 TLS 签发。
4. 将 canonical、sitemap、OG、RSS/JSON Feed 中的站点 URL 改为新域名。
5. 验证旧 URL 301、hreflang、Search Console。

当前仓库使用 BASE_PATH=/dsh-personalnet/ 与 SITE_URL=https://guidchen.github.io；换域名/根路径需要同步修改 CI 变量与 canonical。

### 4.1 高并发能力

静态站没有应用服务器，**并发压力由托管平台/CDN 承担**，不是 Node/Astro 进程：

| 项 | 现状/建议 |
|---|---|
| 首页/项目/笔记 | GitHub Pages CDN 直接返回静态 HTML/CSS/JS；无数据库/冷启动 |
| 图片 | 生成封面经构建优化；CMS 图片受 300KB/文件限制；Cloudflare 迁移后可长缓存 |
| 预取 | 已关闭 prefetchAll，避免滚动时批量请求 |
| 平台限额 | GitHub Pages：1GB 站点、约 100GB/月软带宽；不适合商业高流量 |
| 压测 | 2026-10-24 对公网首页 40 请求、并发 10：p50 约 120ms、p95 约 644ms、40×200（网络相关，仅参考） |
| 更高并发 | Cloudflare Pages（静态请求免费且不限量、全球 CDN）或对象存储+CDN |
| 后台 | 单人写作；GitHub API 有速率限制；不是高并发服务 |

静态站的"高并发"重点是：缓存、压缩、图片预算、少 JS、CDN。不要为了并发租 VPS，除非确实需要服务端计算。

## 5. 中国大陆访问的特殊性

- **大陆服务器**：需要 ICP 备案（工信部/接入商）、域名实名、网站内容合规；备案通常 1–4 周。适合明确面向大陆用户的正式站点。
- **香港/新加坡/海外服务器**：通常免备案，但大陆访问受国际出口、路由与时段影响；需要真实测速。
- **GitHub Pages / Cloudflare Pages**：无需备案；大陆访问质量不稳定，不能承诺。
- **CDN**：大陆 CDN 通常要求备案与实名；海外 CDN 不解决大陆最后一公里。
- 如果主要受众在海外，保持 GitHub Pages/Cloudflare Pages 更合理。

## 6. 安全与运维对比

| 项 | 静态托管 | VPS | 自建 |
|---|---|---|---|
| 系统补丁 | 平台负责 | 自己负责 | 自己负责 |
| TLS | 自动 | 自己续期 | 自己续期 |
| DDoS | 平台缓解 | 需额外防护 | 暴露面最大 |
| 备份 | Git + 平台 | 快照/对象存储 | 本地+异地 |
| 监控 | 平台 | 自己 | 自己 |
| 密钥 | 仓库 token | SSH/环境变量 | SSH/环境变量 |
| 故障恢复 | 重新部署 | 重建实例 | 硬件/网络 |

## 7. 推荐路径

### 现在（不执行）

保持 GitHub Pages + 可选自定义域名。理由是成本 0、已有 CI/CD、安全边界最小。

### 触发迁移的条件

- 需要自定义 CSP/HSTS/重定向/预览部署；
- 需要更好的大陆访问质量；
- 需要服务端函数/表单/鉴权；
- GitHub Pages 的 1 GB/100 GB 软限制成为实际瓶颈。

### 首选替代

**Cloudflare Pages**：静态请求免费、支持 _headers/_redirects、全球 CDN、Git 集成，迁移成本低于 VPS。

### 不推荐

为了"独立"而租 VPS 或自建：除非同时需要服务器端能力、愿意承担运维，或作为学习实验。

## 8. 迁移检查清单（未来）

- [ ] 备份仓库与当前构建产物
- [ ] 确认域名/DNS 管理权
- [ ] 新平台配置 SITE_URL/BASE_PATH
- [ ] 构建命令、Node/pnpm 版本、缓存
- [ ] 301/308 旧路径
- [ ] canonical/hreflang/sitemap/RSS/JSON Feed
- [ ] 404、安全头、CSP
- [ ] Lighthouse/axe/E2E 对公网复测
- [ ] 旧平台保留只读一段时间

## 9. 参考来源

- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages pricing: https://developers.cloudflare.com/pages/functions/pricing/
- Netlify pricing: https://www.netlify.com/pricing/
- Vercel Hobby: https://vercel.com/docs/plans/hobby
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- DigitalOcean Droplets: https://www.digitalocean.com/pricing/droplets
- Hetzner Cloud: https://www.hetzner.com/cloud/
- 工信部备案系统: https://beian.miit.gov.cn/

## 10. 待审阅问题

1. 是否继续使用 GitHub Pages，还是迁移 Cloudflare Pages？
2. 是否购买自定义域名？域名后缀与预算？
3. 主要受众在中国大陆还是海外？是否需要备案？
4. 是否需要服务端能力（表单、鉴权、数据库）？若不需要，VPS/自建没有收益。
