---
adr: 0010
标题: MIT 许可证与社区治理
状态: Accepted
日期: 2026-10-23
决策者: 陈陇刚
---

# ADR 0010：MIT 许可证与社区治理

## 状态

Accepted（2026-10-23）

## 背景

项目要求可开源，允许他人复用与贡献，同时规避模板许可证风险。

## 决策驱动因素

- 最大化复用
- 贡献门槛低
- 无法律不确定性

## 考虑过的选项

- **MIT**：最宽松、最常用
- **Apache-2.0**：含专利授权，但更重
- **CC BY-NC**：限制商用，与开源目标冲突
- **不分发**：无法满足可开源要求

## 决策

代码采用 MIT；内容（文字/图片）默认保留版权，并在 README 说明可引用方式。

## 后果

### 正面

- 复用与贡献无摩擦
- 与 Astro/Tailwind 等依赖许可证兼容

### 负面

- 他人可商用本站代码（可接受）
- 需在文档中区分代码与内容许可

### 后续行动

- 添加 LICENSE、CONTRIBUTING、CODE_OF_CONDUCT、SECURITY；依赖许可清单在文档中维护。

## 相关

- [12-security-privacy-licensing.md](../12-security-privacy-licensing.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)