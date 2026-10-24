---
文档编号: 32
标题: 公开展示与后台/个人信息审计
状态: Approved
最后更新: 2026-10-24
维护者: 陈陇刚
---

# 公开展示与后台/个人信息审计

## 1. 结论

公开站点只展示"作品、方法、公开履历与联系方式"；后台只承担写操作。当前没有把 token、身份证号、手机号、住址等敏感信息放进公开页面。

但需要明确：GitHub Pages 是静态托管，不能对 /admin/ 做真正的登录保护。当前 /admin/ 是**公开只读、noindex、无敏感数据**的仪表盘；写操作由 /admin/cms/ 的 GitHub token 保护。若要求仪表盘"只有本人可看"，必须使用 Cloudflare Access、VPN 或独立私有部署，不能靠前端隐藏。

## 2. 公开页面（应展示）

| 页面/资源 | 内容 | 判断 |
|---|---|---|
| / | 姓名、定位、精选项目、领域、联系方式 | 公开 |
| /projects/ 与详情 | 12 个案例、技术细节、指标、亮点、安全边界 | 公开 |
| /notes/ 与详情 | 6 篇技术笔记、关键要点、实现索引 | 公开 |
| /about/ | 自述、技能、时间线、工作原则 | 公开 |
| /cv/ | 教育、经历、项目、邮箱、城市 | 公开 |
| /now/、/uses/ | 当前状态、工具 | 公开 |
| /github/ | 14 个公开仓库索引 | 公开 |
| /security/ | 安全模型与已知限制 | 公开（透明） |
| /search/ | 公开内容的本地索引 | 公开 |
| RSS / JSON Feed / sitemap / projects.json / OG | 公开内容的机器可读输出 | 公开 |
| 邮箱、GitHub、城市 | 联系与定位 | 公开，已确认无手机号/住址 |

## 3. 公开但不索引（应弱化）

| 路径 | 现状 | 说明 |
|---|---|---|
| /admin/ | 公开只读、noindex、robots 禁止、sitemap 排除 | 内容统计、证据缺口、部署状态、CMS 入口；无 token |
| /admin/cms/ | 公开登录页；写入需 token | Sveltia 登录与编辑器 |
| /admin/cms/config.yml | 公开可读 | 仓库名、collection/schema、auth_methods；无 secret |
| /search/ | noindex、robots 禁止 | Pagefind 结果页 |

### 这些路径的边界

- noindex 与 robots 只阻止搜索引擎，不阻止知道 URL 的人访问。
- 仪表盘显示的是内容运营信息（待补证据、部署状态），不是密钥或个人隐私。
- config.yml 暴露 repo 名与认证方式；攻击者本来就能看到公开仓库，风险主要是信息暴露而非凭据。
- 若要真正限制访问：Cloudflare Access（需要迁移/自定义域）、Netlify Identity、或在私有网络/VPN 后运行。

## 4. 不对外展示（绝不进公开页面）

| 数据 | 处理 |
|---|---|
| GitHub PAT / OAuth secret / Actions secrets | 只在浏览器 localStorage 或仓库 Secrets；不入库 |
| 手机号、身份证号、家庭住址、出生日期 | `check:privacy` 拦截；不发布 |
| .env、私钥、SSH key、云账号凭据 | .gitignore；不入库 |
| 本地文件路径、健康报告原始日志、部署 token | 本地/CI artifact；不发布 |
| 未公开的项目截图/客户数据 | 需作者确认后才能上传 |
| 评论/表单等访客数据 | 当前无此功能 |

## 5. 本次加固

- BaseLayout 增加 meta CSP：public 限制 self/inline/wasm；admin 额外允许 unpkg 与 api.github.com。
- 增加 `referrer` meta；public 页面不允许第三方 connect。
- `public/_headers`：为 Cloudflare/Netlify 预留 nosniff、X-Frame-Options、Referrer-Policy、Permissions-Policy、admin X-Robots、_astro 长缓存；GitHub Pages 会忽略。
- 仪表盘增加"公开只读、无 token、写操作需登录"的提示。
- `check:privacy` 扫描手机号/身份证号/敏感字段，接入 CI 与健康报告。
- 现有 noindex、robots、sitemap 排除、Pagefind ignore 保留。

## 6. 检查命令

~~~bash
pnpm check:privacy
pnpm check:security
pnpm test:e2e --project=webkit tests/e2e/security.spec.ts tests/e2e/admin.spec.ts
pnpm test:a11y --project=webkit
~~~

## 7. 建议

1. 保持公开页面只展示作品与公开履历；不把后台运营信息放进正文或 sitemap。
2. 若 /admin/ 必须私有，优先 Cloudflare Access；不要用前端密码或隐藏路径冒充安全。
3. 每次新增内容运行 check:privacy；截图/客户数据需先脱敏。
4. 迁移到 Cloudflare Pages 后启用 _headers 的 X-Frame-Options/Permissions-Policy 与边缘缓存。
