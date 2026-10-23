---
adr: 0018
标题: GitHub 项目索引采用源文件 + Actions 同步
状态: Accepted
日期: 2026-10-24
决策者: 陈陇刚
---

# ADR 0018：GitHub 项目索引采用源文件 + Actions 同步

## 背景

个人 GitHub 仓库更新频繁，但网站需要稳定、可审阅的展示内容。直接在构建时请求 GitHub API 会让构建依赖网络与额度；把 API 结果直接写入 CMS 又会覆盖人工描述。

## 决策

- 人工维护 `github-project-sources.json`（仓库名、摘要、分类、排序、精选）。
- GitHub Actions 每周/手动/源文件变更时运行同步脚本，补充元数据到 `github-projects.json`。
- 页面只读生成文件；Sveltia 只编辑源文件。
- 同步文件无变化时不 commit。
- 只展示 curated 列表，不自动收录所有 fork/课程仓库。

## 后果

### 正面

- 构建完全静态，不依赖 GitHub API。
- 人工内容与机器元数据分离，不会被同步覆盖。
- 后台改源文件即可触发同步和部署。

### 负面

- 多一个 workflow 与生成文件。
- 仓库改名/删除需要更新源，否则同步失败。
- 依赖 GITHUB_TOKEN 写权限。
