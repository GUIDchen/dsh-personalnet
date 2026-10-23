# 贡献指南

感谢你关注本项目。本项目是个人作品集站点，同时希望作为一份**可复用的静态站工程样例**开源。

## 开发环境

| 依赖 | 版本 |
|---|---|
| Node | ≥22.23.4（见 `.nvmrc`） |
| pnpm | ≥7.1（见 `package.json` 的 `packageManager`） |
| Git | 任意近期版本 |

```bash
pnpm install
pnpm dev
```

## 分支与提交

- 从 `main` 拉分支：`feat/<scope>`、`fix/<scope>`、`docs/<scope>`、`chore/<scope>`。
- 提交信息遵循 Conventional Commits，type 用英文、摘要用中文祈使句：

```
feat(projects): 增加领域筛选与 URL 状态同步
fix(seo): 修正子路径部署下的 canonical
```

- 一次提交只做一件事；格式化与功能改动分开提交。

## 提交前检查

```bash
pnpm lint
pnpm check
pnpm test
pnpm build
```

涉及 UI 的改动请附桌面与移动端截图；涉及内容的改动请确认无隐私信息（见 `docs/12-security-privacy-licensing.md`）。

## Pull Request

PR 描述包含四部分：

1. **变更**：做了什么、为什么。
2. **验证**：运行了哪些命令、结果如何。
3. **截图**：视觉改动前后对比。
4. **文档**：同步更新了哪些文档/ADR。

## 文档

- 文档在 `docs/`，新增文档需在 `docs/README.md` 索引。
- 决策变更需新增 ADR，而不是修改已接受的 ADR 结论。
- 运行 `pnpm test:docs` 校验索引与链接。

## 行为准则

参与本项目即表示同意遵守 `CODE_OF_CONDUCT.md`（M6 提供）。

## 许可

提交代码即表示同意以 MIT 许可证发布。