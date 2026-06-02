---
title: 场景性能优化
project: 天下
direction: 优化
summary: 针对场景中大量 Drawcall，用 Occlusion Culling 剔除被遮挡部分，筛选算法生成并人工校正 Occluder，Drawcall 大幅下降、FPS 明显提升。
featured: false
order: 7
role: ""   # TODO 补个人职责（如「联合程序制定方案并推动落地」）
tags: [性能优化, Occlusion Culling, Drawcall]
---

## 约束与目标

天下项目场景中存在大量 Drawcall，严重影响性能，需要在不牺牲画面的前提下降低开销。

## 方案权衡

- 主要采用 Occlusion Culling 剔除被遮挡部分的 Drawcall。
- 筛选合适的算法生成场景 Occluder，并人工检查、重做不符合要求的 Occluder。

## 落地结果

场景 Drawcall 大幅减少，FPS 有明显提升。
