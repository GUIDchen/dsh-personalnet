---
文档编号: 25
标题: 上线发布检查清单
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 上线发布检查清单

> 当前状态：**v2.9.3 已上线** <https://guidchen.github.io/dsh-personalnet/>。本文保留为后续发布/回滚的执行清单。托管方案对比见 [31-deployment-options.md](./31-deployment-options.md)。

## 1. 前置条件

- GitHub 仓库已创建（建议 `dsh-personalnet`），本地 `main` 已推送。
- 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
- 可选的仓库变量：
  - `SITE_URL`：自定义域名或 Pages 地址；未设置时 workflow 推导为 `https://<owner>.github.io`。
  - `BASE_PATH`：项目页为 `/<repo>/`，用户页为 `/`；未设置时按仓库名推导。
- `public/admin/config.yml` 的 `backend.repo` 改为实际仓库（仅线上后台需要）。

## 2. 本地预检

~~~bash
pnpm deploy:check
~~~

检查项：origin remote、SITE_URL、BASE_PATH、deploy workflow、后台 repo 占位、dist canonical 是否匹配当前变量。

模拟 GitHub Pages 子路径构建：

~~~bash
SITE_URL=https://<owner>.github.io BASE_PATH=/dsh-personalnet/ pnpm build
BASE_PATH=/dsh-personalnet/ node scripts/check-dist.mjs
BASE_PATH=/dsh-personalnet/ node scripts/check-budget.mjs
node scripts/check-seo.mjs
~~~

> `check-dist`、`check-budget` 与 `check:budget` 已支持 `BASE_PATH`；CI 默认根路径，Pages 子路径需带变量运行。

已实测（2026-10-23）：用 `SITE_URL=https://guidchen.github.io`、`BASE_PATH=/dsh-personalnet/` 构建并预览，`/dsh-personalnet/`、`/projects/`、`/en/`、`/admin/`、`sitemap-index.xml` 与 `_astro` CSS 均返回 200。

## 3. 推送与部署

1. 首次推送：`git push -u origin main`。
2. Actions → deploy 运行；或在 Actions 手动 `Run workflow`。
3. 等待 `build`（安装、构建、构建产物校验、上传 artifact）与 `deploy`（deploy-pages）。
4. 记录 environment URL；若失败，查看 build 日志与 `pnpm test:integration` 输出。

## 4. 上线后验证

| 项 | 检查 |
|---|---|
| 首页 | 200、无控制台错误、主题切换 |
| 项目库 | 筛选/排序/URL 状态、12 个项目 |
| 项目详情 | 面包屑、TOC、JSON-LD、相关项目 |
| 笔记 | 列表/详情、阅读时长、RSS |
| 关于/简历 | 打印样式、PDF |
| 搜索 | Pagefind 索引、⌘K 面板、中英文 |
| 英文 | `/en/`、语言切换、hreflang、canonical |
| 后台 | `/admin/` 200、noindex、登录/本地模式 |
| 机器可读 | sitemap、robots、projects.json、rss.xml、OG |
| 质量 | LHCI 10 个 URL、axe 17 页、链接检查 |
| 安全 | HTTPS、无 secret 泄露、后台 robots 禁止 |

## 5. 版本与回滚

- 验证通过后：更新 `CHANGELOG` 为 `2.0.0`、`CITATION`/README 版本、创建 annotated tag `v2.0.0` 并推送。
- 回滚：`git revert <commit>` 后推送触发重新部署；或在 Actions 选择上一个成功 run 重新部署。
- Pages 故障：检查 Settings → Pages 源、environment 保护规则、artifact 上传步骤。

## 6. 自定义域名

1. 在仓库 Pages 设置中填写域名并启用 HTTPS。
2. 设置 `SITE_URL=https://<domain>`；项目页若部署在根域名，设置 `BASE_PATH=/`。
3. 重新运行 deploy，检查 canonical/hreflang/sitemap 全部使用新域名。

## 7. 当前阻塞

- 本地没有 `origin` remote；环境没有 GitHub token/gh CLI，无法代替作者建仓。
- Pages 的启用是仓库级设置，必须在 GitHub 网页完成一次。
- 远程就绪后，本清单 §2–§5 可在单轮内执行完毕。
