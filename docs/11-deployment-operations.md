---
文档编号: 11
标题: 部署与运维
状态: Draft
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 部署与运维

## 1. 环境

| 环境 | 触发 | URL | 用途 |
|---|---|---|---|
| 本地 | `pnpm dev` | `http://localhost:4321` | 开发调试 |
| 预览 | PR | CI 产物 / Pages 预览 | 评审 |
| 生产 | push `main` | `SITE_URL` | 正式站点 |

## 2. 构建

```bash
pnpm install --frozen-lockfile
pnpm build            # 输出 dist/
pnpm test:integration # 断言产物
```

产物结构：

```
dist/
├─ index.html
├─ projects/index.html
├─ projects/<slug>/index.html
├─ about/index.html
├─ search/index.html
├─ 404.html
├─ rss.xml
├─ sitemap-index.xml
├─ robots.txt
├─ projects.json
├─ og/<slug>.png
├─ pagefind/
└─ _astro/（带 hash 的 CSS/JS/字体/图片）
```

## 3. GitHub Pages（默认）

### 3.1 首次配置

1. 创建仓库并推送（命令见 §8）。
2. Settings → Pages → Source 选择 **GitHub Actions**。
3. 如需自定义域名，填写 Custom domain 并开启 Enforce HTTPS。

### 3.2 工作流

```yaml
name: deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          SITE_URL: ${{ vars.SITE_URL }}
          BASE_PATH: ${{ vars.BASE_PATH }}
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### 3.3 子路径部署

项目页地址形如 `https://<user>.github.io/<repo>/`：

```bash
SITE_URL=https://<user>.github.io BASE_PATH=/<repo>/ pnpm build
```

所有内部链接通过 helper 拼接 base，禁止硬编码 `/projects/`。

## 4. Cloudflare Pages（备选）

| 项 | 值 |
|---|---|
| Build command | `pnpm build` |
| Output directory | `dist` |
| 环境变量 | `SITE_URL`、`BASE_PATH` |
| Node 版本 | 24（`.nvmrc`） |

根域部署时 `BASE_PATH=/`。如需响应头：

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

GitHub Pages 不支持自定义响应头，CSP 通过 meta 标签注入。

## 5. 域名与 DNS

1. 在 DNS 添加 `CNAME` 指向 `<user>.github.io`（根域用 A/AAAA 记录）。
2. 仓库 `public/CNAME` 写入域名，或使用 Pages 设置。
3. 开启 HTTPS 强制跳转。
4. `SITE_URL` 更新后重新构建，确保 canonical/sitemap 正确。

## 6. 缓存策略

| 资源 | 缓存 |
|---|---|
| `/_astro/*`（hash 命名） | `public, max-age=31536000, immutable` |
| 图片 | 同上 |
| HTML | `public, max-age=0, must-revalidate` |
| `pagefind/*` | 短期（1 天） |

GitHub Pages 默认缓存策略有限，hash 命名保证更新生效；Cloudflare 可显式配置。

## 7. 发布与回滚

### 7.1 发布流程

1. 分支开发 → PR。
2. CI 全绿 + 评审通过 → squash merge 到 `main`。
3. `deploy.yml` 自动构建并发布。
4. 发布后 5 分钟内检查：首页 200、关键页面、搜索、OG 图、控制台无错误。
5. 更新 `CHANGELOG.md`（里程碑版本）。

### 7.2 回滚

| 场景 | 操作 |
|---|---|
| 内容错误 | revert 对应 commit，重新触发部署 |
| 构建失败 | 修复后重跑；上一版本仍在线 |
| 依赖回归 | `git revert` 依赖升级提交；锁文件回滚 |
| 平台故障 | 切换到 Cloudflare Pages（同一产物） |

目标：5 分钟内恢复。

## 8. 远程仓库与推送

本机未安装 `gh` CLI，需手动创建仓库后执行：

```bash
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

## 9. 监控与告警

| 项 | 方式 |
|---|---|
| 可用性 | 托管平台状态页；可选 UptimeRobot 免费监控 |
| 错误 | 无客户端错误上报（隐私）；CI 与部署失败通知到邮箱 |
| 性能 | LHCI 每周定时跑一次，报告归档 |
| 链接 | 每周定时检查外部链接 |
| 依赖 | dependabot 每周 PR + `pnpm audit` |

## 10. Runbook

### 10.1 页面 404（线上）

1. 检查部署状态与最新 commit。
2. 本地 `pnpm build && pnpm preview` 复现。
3. 确认 `BASE_PATH` 与链接拼接。
4. 必要时回滚。

### 10.2 搜索无结果

1. 打开 `/pagefind/pagefind-entry.json` 是否 200。
2. 检查构建日志是否生成索引。
3. 子路径部署时确认 `baseUrl` 配置。

### 10.3 性能下降

1. 对比 LHCI artifact 的指标变化。
2. 检查新增依赖、图片、字体、脚本。
3. 用 `check-budget` 定位体积增长来源。