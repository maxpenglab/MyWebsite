import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 作品集合：每个项目 = src/content/projects/ 下的一个 .md 文件
// 想加作品就新建一个 .md，想删就删文件。字段写错构建会报错提示。
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),                  // 效果名，如「假室内渲染」
    project: z.string(),                // 所属：明日之后 / 天下 / 七日世界 / 个人作品
    direction: z.enum(['渲染', '特效', '优化', '动画', '美术流程']), // 方向，决定筛选
    summary: z.string(),                // 卡片上显示的项目简介（1~2句，硬数字/专利在这里带一句）
    featured: z.boolean().default(false), // 是否进首页「精选」
    order: z.number().default(99),      // 排序，越小越靠前
    role: z.string().optional(),        // 团队项目里你负责什么（个人作品可不填）
    tags: z.array(z.string()).default([]),
    video: z.string().optional(),       // 视频路径，如 /video/xxx.mp4
    cover: z.string().optional(),       // 封面图，如 /image/xxx.png
    poster: z.string().optional(),      // 视频封面帧，加速首屏
  }),
});

export const collections = { projects };
