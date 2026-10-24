---
adr: 0022
标题: WebGL 实验默认静止，按需播放
状态: Accepted
日期: 2026-10-24
决策者: 陈陇刚
---

# ADR 0022：WebGL 实验默认静止

## 背景

实验页若首屏持续 rAF，会占用 CPU、抬高 TBT，且对 reduced-motion 不友好。

## 考虑过的选项

- **自动播放动画**：视觉更直接，但持续 rAF 抬高 TBT，且违反 reduced-motion。
- **引入 Three.js/Spline**：生态成熟，但包体与版本维护成本超出单个实验页收益。
- **纯 CSS 动画**：零 JS，但无法呈现 shader 的场效果。
- **静态首帧 + 用户主动播放**：默认零持续动画，保留交互。

## 决策

- 自定义 shader，不引入 Three.js/Spline。
- 首屏只渲染一帧静态画面；点击 Play 才开始动画。
- IntersectionObserver 离开视口暂停；reduced-motion 隐藏播放并保持静止。
- 无 WebGL 时显示 CSS 降级。

## 后果

优点：默认无持续动画、LHCI 可通过、用户主动选择交互。
代价：实验不是自动播放的“炫技”页；需要额外按钮状态。
