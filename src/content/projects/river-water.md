---
title: 河水效果
project: 明日之后
direction: 渲染
summary: 画质升级中重做河水，用 SSR mask 消岸边硬边、深度控色、菲涅尔控透明，让水体在新画质标准下与场景自然融合。
featured: true
order: 2
role: ""   # TODO 补个人职责
tags: [Shader, 水体, SSR, 菲涅尔]
video: https://video.maxpeng.dev/Water_Game.mp4?v=3
cover: /image/Cover_Water.webp
poster: /image/Poster_Water.webp
---

## 约束与目标

明日之后画质升级后，渲染氛围与场景美术变化较大，原有河水效果已无法满足新基建标准，需要重做并与新场景融合。

## 方案权衡

- **岸边硬边**：硬边主要来自 SSR。通过深度计算出一张 SSR mask，减弱岸边的 SSR 强度，让河水与岸边自然过渡。
- **河水颜色**：用河水深度改变颜色，模拟水体对光照的吸收；用视线与水面夹角改变透明度，模拟菲涅尔现象。
- **远处噪点**：依据水面与人物的距离动态调整法线 tiling，避免远处水波过密产生噪点。

## 落地结果

河水在新画质标准下与场景融合度明显提升，远近表现一致，满足基建要求。
