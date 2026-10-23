---
文档编号: 27
标题: 媒体与内容证据
状态: Approved
最后更新: 2026-10-23
维护者: 陈陇刚
---

# 媒体与内容证据

## 1. 存储

- CMS 上传目录：`public/media/projects/`
- Sveltia 项目 collection：`media_folder: public/media/projects`、`public_folder: /media/projects`
- 前端通过 `ProjectMedia` 统一补 `BASE_URL`，兼容 `/dsh-personalnet/` 子路径。
- 图片不经过 `astro:assets` 构建期优化；用体积预算、lazy 与固定比例控制成本。

## 2. 字段

- `cover.src`：image widget；无封面时回退 `src/assets/covers/<slug>.jpg`。
- `gallery[].src`：image widget，最多 6 张；alt 必填。
- 兼容旧路径：`src/assets/projects/...` 仍可通过 glob 解析为 URL；外链 https 也支持。

## 3. 约束

| 项 | 限制 |
|---|---|
| 单文件 | ≤300KB |
| 总量 | ≤8MB |
| 格式 | jpg/jpeg/png/webp/avif/svg |
| 封面比例 | 16:10 |
| 图库长边 | ≤2000 |
| alt | 必填 |

`pnpm check:media` 检查格式/体积/引用；`check-content` 校验 schema。

## 4. 使用

1. 打开 `/admin/cms/`，进入项目。
2. 封面/图库字段上传图片，填写 alt。
3. 保存 → commit → Actions 部署。
4. 本地构建后查看详情；图库应出现网格与灯箱。

**子路径提示**：线上 CMS 在 `/dsh-personalnet/admin/cms/` 下预览 `/media/...` 可能 404；本地 Chrome 编辑与站点渲染不受影响。

## 5. 内容健康度

已发布项目按 5 项计分：GitHub 源码、封面、图库、指标、Demo/论文/文档。仪表盘显示完整度与待补项；不伪造缺失内容。

## 6. 测试

- 单测：`resolveMediaUrl` 的 base/外链/重复前缀。
- E2E：封面回退、图库、灯箱、后台上传配置。
- `check:media`、`check:dist`、LHCI。
