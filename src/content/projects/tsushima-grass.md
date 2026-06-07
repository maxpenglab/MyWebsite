---
title: 对马岛之魂草地渲染复刻
project: 个人作品
direction: 渲染
summary: 个人自驱项目，用 Unity 从零搭建 GPU 驱动的草地渲染管线：Compute Shader 算数据、Indirect Draw 单 Drawcall 绘制海量草、分 Tile LOD 与 Async Compute 并行。
featured: true
order: 3
role: 个人独立项目，独立完成全部设计与实现
tags: [Unity, Compute Shader, GPU Instancing, LOD, Async Compute]
video: https://video.maxpeng.dev/Grass.mp4
cover: /image/Cover_Grass.webp
poster: /image/Poster_Grass.webp
---

## 动机

个人很喜欢《对马岛之魂》的画面，尝试用 Unity 还原其中的草地渲染——这是一个用来打磨底层渲染编程能力的自驱项目。

## 实现思路

- **数据计算**：用 Compute Shader 计算渲染草所需的全部数据（几何信息、草的动态信息、材质信息等）。
- **绘制**：用 Unity 的 `DrawProceduralIndirect` 绘制，这是 GPU Instancing 的一种实现，一次 Drawcall 绘制大量草 Instance，绘制数据来自上一步的 Compute Shader。
- **LOD**：将整个 Terrain 分成若干 Tile，每个 Tile 跑一个独立的 Compute Shader，按摄像机距离选择 LOD 层数。
- **并行优化**：分 Tile 后用 Async Compute，在上一个 Tile 走 Graphics 管线的同时开启下一个 Tile 的 Compute 计算，提高并行效率。

## 价值

该项目从零搭建了一套 GPU 驱动的草地渲染管线，覆盖 Compute → Indirect Draw → LOD → 异步并行的完整链路，体现独立构建渲染技术的能力。
