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
