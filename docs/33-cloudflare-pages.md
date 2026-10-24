---
文档编号: 33
标题: Cloudflare Pages 双站部署
状态: Draft（待授权部署）
最后更新: 2026-10-24
维护者: 陈陇刚
---

# Cloudflare Pages 双站部署

## 1. 目标

保留 GitHub 仓库与现有 GitHub Pages 站点，同时把同一份代码完整构建并部署一份到 Cloudflare Pages。

两个站点共享源码，不复制代码：

| 站点 | 路径 | 用途 |
|---|---|---|
| GitHub Pages | https://guidchen.github.io/dsh-personalnet/ | 现有主站，继续保留 |
| Cloudflare Pages | https://dsh-personalnet.pages.dev/ | 新增独立副本，根路径部署 |

Cloudflare 构建使用 `SITE_URL=https://dsh-personalnet.pages.dev`、`BASE_PATH=/`；GitHub Pages 继续使用原有的 BASE_PATH。两者 canonical、sitemap、RSS/Feed 各自独立。

## 2. 已提交的部署配置

- `wrangler.toml`：项目名、输出目录 dist、compatibility date。
- `.github/workflows/deploy-cloudflare.yml`：手动触发，安装依赖、构建、调用 wrangler-action 部署。
- `scripts/deploy-cloudflare.mjs`：本地构建 + 部署，支持 API token 或 wrangler login。
- `package.json`：`pnpm deploy:cloudflare`。
- `public/_headers`：Cloudflare 上生效的安全头与 `_astro` 长缓存；GitHub Pages 会忽略。

## 3. 授权方式（二选一）

### A. Dashboard Git 集成（推荐长期）

1. Cloudflare Dashboard → Workers & Pages → Pages → Connect to Git。
2. 选择 GitHub 仓库 GUIDchen/dsh-personalnet，分支 main。
3. Build command：`pnpm build`；Output directory：`dist`。
4. 环境变量：
   - `SITE_URL=https://dsh-personalnet.pages.dev`
   - `BASE_PATH=/`
   - `PNPM_VERSION=12.8.1`
   - `NODE_VERSION=24`
5. 保存并部署。之后每次 push main，Cloudflare 自动构建；GitHub Pages 的 deploy workflow 不受影响。

### B. API Token（手动/CI）

创建 Cloudflare API Token，权限至少：

- Account → Cloudflare Pages: Edit
- Account → Account Settings: Read（获取 Account ID）

然后在本地：

~~~bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
pnpm deploy:cloudflare
~~~

或在 GitHub 仓库 Secrets 配置 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`，手动运行 deploy-cloudflare-pages workflow。可设置仓库变量 `CLOUDFLARE_SITE_URL`、`CLOUDFLARE_PROJECT_NAME`。

### C. Wrangler 本地登录

~~~bash
npx wrangler login
npx wrangler pages project create dsh-personalnet --production-branch=main
npx wrangler pages deploy dist --project-name=dsh-personalnet --branch=main
~~~

登录凭据保存在本机 wrangler 配置，不进入仓库。

## 4. 当前状态

- 配置已提交，GitHub Pages 继续在线。
- **尚未执行 Cloudflare 部署**：当前环境没有 Cloudflare API token，也没有完成 wrangler 登录。
- 完成授权后运行 `pnpm deploy:cloudflare` 或手动运行 workflow。

## 5. 部署后验收

- [ ] `https://dsh-personalnet.pages.dev/` 200
- [ ] `/projects/`、`/notes/`、`/github/`、`/security/`、`/admin/` 200
- [ ] canonical/sitemap/RSS/JSON Feed 指向 pages.dev
- [ ] `_headers` 生效：X-Frame-Options、Permissions-Policy、admin X-Robots、_astro 缓存
- [ ] admin token 登录、编辑、commit 正常
- [ ] E2E/a11y/LHCI 对 pages.dev 复测
- [ ] 自定义域名（可选）与 TLS

## 6. 双站边界

- 两个站点部署同一 commit；内容不会分叉。
- Cloudflare 是新增副本，不替换 GitHub Pages；保留 GitHub 作为源码与发布记录。
- 若未来只保留一个公网站点，先在 Cloudflare 验证 301/域名，再决定是否下线另一个。
- 不在仓库中保存 Cloudflare token；使用 GitHub Secrets 或本机 wrangler 登录。
