---
文档编号: 24
标题: 维护日志
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 维护日志

> 追加式记录。每轮 Agent 长跑或人工维护后追加一行/一节；不修改历史结论。

## 2026-10-23

| 轮次 | 范围 | Commit | 验证 | 遗留 |
|---|---|---|---|---|
| M9 | 审计、Hero、Now/Uses、命令面板、Gallery | 3a82e67 | ci:verify、E2E 44、axe 11、LHCI 8 | 项目真实证据待补 |
| M10 | 中英文界面、/en 路由、hreflang | 5851c19 | ci:verify、E2E 59、axe 17、LHCI 10 | 项目/笔记正文仍为中文 |
| M11 | Sveltia 后台、内容模型、check-admin | 1ecadeb | ci:verify、E2E 61、Chrome 本地入口实测 | 线上认证需仓库与 PAT/OAuth |
| M12 | 健康报告、maintenance workflow、长跑契约 | 6054c27 | ci:verify、pnpm health、E2E 61、axe 17 | 定时任务需远程仓库 |
| M13 准备 | Pages 默认变量、deploy:check、BASE_PATH 校验 | 69da95e | ci:verify、E2E 61、子路径预览 6 路由 200 | 等待远程仓库与 Pages 启用 |
| M13 完成 | GitHub Pages 上线、v2.0.0 tag 与 Release | d74a7ba | 公网 4 页 LHCI、CI success、tag/release | — |
| M14 | 管理仪表盘、/admin/cms、site collection、JSON 迁移 | 75fd6cf | ci:verify、E2E 66、axe 18、LHCI 10 | — |
| M15 | 项目封面卡、RepoLink、About 双栏、搜索快捷词 | 75fd6cf | 截图走查、E2E、预算 | 项目仓库 URL 仍缺 10 个 |
| v2.1.0 | 管理平台/视觉升级发布 | fb39503 | 公网 200、CI success、tag/release | 10 个仓库 URL 待补 |
| M16 | 媒体、图库、内容健康度、后台部署状态 | 6f8c07b | check:media、E2E 72、axe 18 | 真实图片待上传 |
| M17 | 3 篇笔记、JSON Feed、视觉细化 | 6f8c07b | feed 18 条、E2E、LHCI | — |
| v2.2.0 | 媒体/证据发布 | 6f8c07b / 9b7dbcc | 公网 200、deploy/CI success、tag/release | 真实截图与 10 个仓库 URL 待补 |
| M19 | 12 项目 + 6 笔记英文标题/摘要 | 45e8ec8 | 英文页面/E2E/构建 | 英文正文仍为中文 |
| v2.3.0 | 双语内容发布 | 45e8ec8 | 公网 200、deploy success、tag/release | 真实截图与 10 个仓库 URL 待补 |
| M20 | 后台 token-only 登录、登录指引、auth 校验 | 本提交 | Chrome token 登录成功、新建项目表单 | OAuth 仍需 Worker |
| M21 | GitHub 项目索引、双语页、后台源、Actions 同步 | 744222f | 13 仓库、E2E 77、a11y 20、LHCI 11 | 首次 sync 成功 |
| v2.4.0 | GitHub 项目与后台联动发布 | b1bb632 | 公网 200、sync/deploy success、tag/release | 真实截图/仓库 URL 仍待补 |
| M23 | About/笔记/项目详情、安全页、CSS 背景 | 37779c5 | E2E 81、a11y 22、LHCI 12 | — |
| v2.5.0 | 阅读体验、安全模型与背景视觉 | 37779c5 | 公网 200、deploy success、tag/release | 真实截图/仓库 URL 仍待补 |
| M25 | 滚动流畅度、项目技术细节、笔记实现索引 | d9edfba | E2E 81、a11y 22、LHCI 12、check:perf | — |
| v2.6.0 | 流畅度与内容深度 | d9edfba | 公网 200、deploy success、tag/release | 真实截图/仓库 URL 仍待补 |
| M27 | 完成度复审、关闭全视口预取、隐私检查 | e8f8aa2 | health 14、check:perf/privacy | — |
| v2.7.0 | 复审与滚动/隐私收口 | e8f8aa2 | 公网 200、deploy success、tag/release | 真实截图/仓库 URL 仍待补 |
| M29 | CSP/安全头、并发探测、公开/私有审计 | 41544cb | check:security/privacy、test:load 40×200 | — |
| v2.8.0 | 安全头与信息展示审计 | 41544cb | 公网 200、deploy success、tag/release | 真实截图/仓库 URL 仍待补 |
| Cloudflare | Pages 直接上传双站 | 897f694 / be3a0b2 | guidchen.pages.dev 200、headers/search/admin | 未接 Git 自动部署 |
| 维护增强 | 内容证据审计、站点/媒体健康检查、链接容错 | 本提交 | health 14 项 0 失败 | — |

### 备注

- M9–M15 已推送到 `GUIDchen/dsh-personalnet` 的 `main`；v2.0.0 与 v2.1.0 tag/Release 均已创建。
- v2.1.0 GitHub Actions CI、deploy 均成功；公网地址 https://guidchen.github.io/dsh-personalnet/。
- v2.2.0 发布时发现仓库曾变为 private 导致 Pages 404；已恢复 public、重建 Pages 并重新部署成功。
- v2.2.0 的 main CI（9b7dbcc）与 deploy 均成功；公网 /、/notes/、/feed.json、/admin/ 均 200。
- 公网地址：https://guidchen.github.io/dsh-personalnet/；Pages Source 为 GitHub Actions。
- 阻塞条件（仓库不存在）已由用户授权后解除。
- 项目截图、仓库/Demo 链接、量化指标需要作者提供，Agent 未伪造。
- 英文页面中的中文正文已用 `lang="zh-CN"` 标注，并在页面提示。
- 后台 `backend.repo` 已指向 `GUIDchen/dsh-personalnet`；线上编辑需登录 GitHub 或配置 OAuth Worker。
