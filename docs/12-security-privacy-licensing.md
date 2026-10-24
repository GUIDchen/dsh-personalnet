---
文档编号: 12
标题: 安全、隐私与许可
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 安全、隐私与许可

## 1. 威胁模型

静态站点没有服务端，但仍有攻击面：

| 威胁 | 场景 | 影响 | 缓解 |
|---|---|---|---|
| 供应链投毒 | 依赖包恶意更新 | 构建产物被注入脚本 | lockfile、dependabot 审阅、`pnpm audit`、禁止任意 postinstall |
| MDX 注入 | 内容中嵌入危险组件/脚本 | XSS（若渲染用户内容） | 内容仅作者可写；限制可用组件；不在 MDX 中执行任意表达式 |
| 第三方脚本 | 分析/字体 CDN 被篡改 | 数据外泄、性能下降 | 默认零第三方请求；自托管资源 |
| 密钥泄露 | 误提交 token | 仓库被滥用 | pre-commit 扫描、`.gitignore`、GitHub secret scanning |
| 点击劫持 | 被 iframe 嵌入 | 钓鱼 | CSP `frame-ancestors 'none'`（Cloudflare）或 meta |
| 内容抄袭/篡改 | 无 | 低 | 版权声明；仓库历史可追溯 |

## 2. 内容安全策略（CSP）

通过 Astro `security.csp`（v6 起稳定）生成：

```
default-src 'self';
img-src 'self' data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'sha256-...';
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

- 内联主题脚本使用 hash 白名单，不使用 `unsafe-inline` 执行脚本。
- 若启用 Umami，将域名加入 `script-src` 与 `connect-src`。
- GitHub Pages 无法设置响应头时，通过 `<meta http-equiv="Content-Security-Policy">` 注入（能力弱于响应头，文档说明）。

## 3. 依赖策略

| 规则 | 说明 |
|---|---|
| 锁文件 | `pnpm-lock.yaml` 必须入库，CI 用 `--frozen-lockfile` |
| 安装脚本 | `pnpm.onlyBuiltDependencies` 白名单，只允许必要包（如 sharp） |
| 升级 | dependabot 每周分组；astro 生态单独一组 |
| 审计 | `pnpm audit --prod` 进 CI；高危立即处理 |
| 新增依赖 | 需在 PR 说明用途、许可证、体积影响 |
| 许可证 | 只接受 MIT/Apache-2.0/BSD/ISC 等宽松许可 |

## 4. 隐私

### 4.1 数据收集

- 默认**不收集**任何个人数据：无 Cookie、无指纹、无第三方分析。
- 可选 Umami：仅页面路径、来源、设备类型，无 PII，无跨站追踪；启用需更新本文件。
- 联系邮箱为公开信息；表单（若未来添加）注明用途与保留期。

### 4.2 发布内容脱敏（硬约束）

| 字段 | 默认 | 说明 |
|---|---|---|
| 姓名 | 发布 | 站点主体 |
| 邮箱 | 发布（可替换为表单） | 联系需要 |
| 手机号 | **禁止** | `check-privacy` 拦截 |
| 年龄/出生日期 | **禁止** | 无必要 |
| 籍贯/住址 | **禁止** | 隐私 |
| 政治面貌 | **禁止** | 无必要 |
| 身份证/护照 | **禁止** | 高危 |
| 学校/学历 | 发布 | 可公开 |
| 项目与基金号 | 发布 | 公开信息 |
| 照片 | 默认不用 | 除非明确同意 |

实现：`pnpm check:privacy`（`scripts/check-privacy.mjs`）扫描 `src/content`、`src/data`、`docs`，命中手机号/身份证号正则或敏感键名即失败；已接入 CI 与健康报告。

## 5. 泄漏处理

1. 立即撤销泄露凭据。
2. 从 Git 历史清除（`git filter-repo`）并强推（需协调）。
3. 在 `SECURITY.md` 记录处理时间线（不含敏感细节）。
4. 复盘并补充 pre-commit 规则。

## 6. 许可证

### 6.1 本项目

- 代码：MIT（见根目录 `LICENSE`）。
- 文字与图片：保留版权，引用需注明来源；禁止整站复制用于商业培训。
- 第三方依赖：遵循各自许可证，清单在 `package.json` 与 `pnpm-lock.yaml` 可追溯；不引入 GPL/AGPL 依赖。

### 6.2 依赖许可核查（关键项）

| 依赖 | 许可证 |
|---|---|
| Astro | MIT |
| Tailwind CSS | MIT |
| Pagefind | MIT |
| Vitest / Playwright | MIT / Apache-2.0 |
| Geist / JetBrains Mono 字体 | SIL OFL 1.1 |
| astro-og-canvas | MIT |

### 6.3 内容许可说明

- 项目案例中的图片若来自第三方，必须标注来源与许可；无法确认来源的图片不得使用。
- 引用论文图表需获得许可或使用自绘版本。

## 7. 安全披露

见根目录 `SECURITY.md`：通过邮箱私下报告，7 天内确认，30 天内修复或说明。范围包括依赖漏洞、CSP 绕过、XSS、隐私泄露。