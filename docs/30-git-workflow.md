---
文档编号: 30
标题: Git 工作流与变更记录
状态: Approved
最后更新: 2026-10-24
维护者: 陈陇刚
---

# Git 工作流与变更记录

本项目从第一次提交起就是标准 Git 仓库，所有代码、内容、文档、测试与配置都通过提交记录；不存在只在服务器上改、不入库的配置。

## 1. 仓库事实

- 远程：https://github.com/GUIDchen/dsh-personalnet
- 默认分支：main
- 当前版本：2.7.0
- 发布标签：v1.0.0、v1.1.0、v1.2.0、v2.0.0 至 v2.7.0
- 发布记录：CHANGELOG.md 与 GitHub Releases
- 内容、页面、后台配置、CI 与文档同一仓库

## 2. 每次修改的最小流程

~~~bash
git switch -c feat/<scope>
# 修改内容
pnpm format
pnpm lint
pnpm check
pnpm test
pnpm build
git add -A
git commit -m "feat(scope): 说明改了什么"
git push -u origin HEAD
~~~

合并到 main 后，GitHub Actions 执行 CI；Pages 部署由 deploy workflow 完成。

## 3. 提交信息

使用 Conventional Commits：

| type | 用途 |
|---|---|
| feat | 新功能 |
| fix | 修复 |
| perf | 性能 |
| docs | 文档 |
| test | 测试 |
| refactor | 重构 |
| chore | 维护 |

格式：type(scope): 中文祈使句。一次提交只做一件可回滚的事；格式化与功能改动分开。

## 4. 分支与保护

- main 只接受通过 CI 的提交；推荐开启 GitHub 分支保护，要求 PR 与 CI。
- 个人维护可直接提交 main，但每次提交必须能说明动机与验证。
- 禁止 force push 已发布的 main/tag；发布后只追加修复提交。
- 标签使用语义化版本；发布时同步 CHANGELOG 与 GitHub Release。
- 不在仓库中提交 token、OAuth secret、.env 或构建产物。

## 5. 变更记录在哪里

| 记录 | 位置 |
|---|---|
| 每次改动 | Git commit + GitHub 历史 |
| 版本变化 | CHANGELOG.md |
| 发布产物 | GitHub Releases + tag |
| 决策 | docs/adr/ |
| 长跑日志 | docs/24-maintenance-log.md |
| 自动检查 | GitHub Actions 运行记录 |
| 完成度 | docs/19-project-completion-audit.md |

## 6. 审计命令

~~~bash
git status
git log --oneline --decorate -20
git tag --sort=-v:refname
git diff --stat
git show --stat HEAD
~~~

## 7. 发布

1. 更新 package.json / CITATION.cff / CHANGELOG。
2. 运行完整 CI 与 LHCI。
3. 提交并推送 main。
4. 创建 annotated tag（例如 v2.7.0）。
5. 创建 GitHub Release。
6. 在 docs/24-maintenance-log.md 记录 commit、验证与遗留。

## 8. 当前约束

- 真实项目截图与 10 个仓库 URL 仍待作者提供；它们不是 Git 工作流问题。
- 部署研究见 docs/31-deployment-options.md，当前不切换托管。
