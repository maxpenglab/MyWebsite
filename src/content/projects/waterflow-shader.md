---
title: 屏幕流水 Shader 优化
project: 七日世界
direction: 优化
summary: 主机端屏幕流水 Shader 卡顿优化，把基于高度图的有限差分插值改为 ddx/ddy 求导，耗时从 0.6ms 降到 0.25ms 且视觉不打折。
featured: false
order: 6
role: ""   # TODO 补个人职责
tags: [Shader, 性能优化, ddx/ddy, ALU]
---

## 约束与目标

屏幕流水 Shader 性能消耗严重，造成主机设备卡顿，需要在保证视觉效果的前提下优化。

## 方案权衡

将 Shader 中原本基于高度图的有限差分插值算法改为使用 `ddx`、`ddy` 直接求导，大幅节省 ALU。

## 落地结果

Shader 耗时从 0.6ms 降低到 0.25ms，同时视觉效果仍满足美术要求。
