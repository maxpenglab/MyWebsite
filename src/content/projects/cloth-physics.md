---
title: UE 角色布料物理
project: 天下
direction: 动画
summary: 多层服装（披风、腰甲、裙摆、配饰）的布料解算，用 Chaos Cloth 与 Kawaii Physics 软硬分治，多套碰撞体解决层间穿插与高速穿透。
featured: true
order: 4
role: ""   # TODO 补个人职责
tags: [UE, Chaos Cloth, Kawaii Physics, 碰撞]
video: https://video.maxpeng.dev/Cloth_Game.mp4?v=3
cover: /image/Cover_Cloth.webp
poster: /image/Poster_Cloth.webp
---

## 约束与目标

角色服装由外层披风、中层腰甲、内层裙摆及若干配饰组成。主要难点在于腰甲与身体穿插、披风与腰甲穿插、配饰与身体穿插。

## 方案权衡

- **软硬分治**：偏柔性的布料（披风、裙摆）用 Chaos Cloth；偏硬性的物质（腰甲、配饰）用 Kawaii Physics。
- **穿插**：主要通过调整碰撞体解决，不同布料准备多套碰撞体防止彼此穿插。
- **高速穿透**：飞行速度过快时布料会穿透碰撞体，通过提高物理计算频率或尽量避免布料与身体碰撞来缓解。

## 落地结果

多层服装在运动与飞行状态下穿插问题得到有效控制。
