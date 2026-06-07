# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

彭洋 Max Peng 的技术美术个人作品集站。Astro 5 + Content Collections，纯 CSS，无外部 JS bundle。
**已上线**：GitHub `maxpenglab/MyWebsite`（分支 `main`）→ Cloudflare Pages 自动构建部署 → <https://maxpeng.pages.dev>。
推到 `main` 即自动重新部署，无需手动操作。

## 命令

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/（字段类型错误会在此报错）
npm run preview  # 预览构建产物
```

## 部署

- Cloudflare Pages 连仓库；构建命令 `npm run build`、输出目录 `dist`、preset `Astro`、分支 `main`。
- 正式域名写在 `astro.config.mjs` 的 `site`；换自定义域后改这里再 push。
- 静态站（无 SSR adapter），全部页面构建期生成。

## 技术架构

**数据流**：`src/content/projects/*.md` → Zod schema（`src/content.config.ts`）→ `getCollection('projects')` → 页面组件。

- `index.astro`：`getCollection` 后按 `featured`/`order` 拆两路，分别渲染精选横向轮播和全部网格。
- `work/[id].astro`：`getStaticPaths()` 构建期生成全部详情页；`render(entry)` 把 markdown body 转成 `<Content />`。
- `ProjectCard.astro`：接收单条 entry 的 data，内联 `style="--c:var(--dir-{direction})"` 把方向色注入子元素，无需逐层传 prop；媒体带 `transition:name` 做页面切换的共享元素过渡。

**构建期 SVG 生成**（不是运行时 JS）：用纯 JS 在 frontmatter 里算透视网格点 + 正弦位移，输出字符串塞进 `<polyline points="">`。
- `index.astro`：hero 右侧「线框高度场」（`COLS/ROWS/W/H` 调参）、区块间母题点阵（`buildMotif(MC,MR,MH,flip)`，`MW` 调参）。
- `work/[id].astro` 的左右流场侧栏是**运行时** JS 生成（见下），不是构建期。

**客户端 JS 全在 `.astro` 的 `<script is:inline>` 块，无外部 bundle。**因为启用了 ClientRouter（无刷新换页），inline script 只在首次解析时跑一次，所以有一套统一模式，改 JS 必须遵守：

- 每页初始化逻辑挂在 `document.addEventListener('astro:page-load', init)`（首次加载和每次导航后都会触发）。
- 用 `window.__xxxBound` 标志位保证 `page-load` 只注册一次，避免跨导航累积监听器（`__baseBound` / `__indexBound` / `__caseBound`）。
- 每页的监听器和 `requestAnimationFrame` 用 `AbortController` 管理，在 `astro:before-swap` 时 `abort()` 清理；观察器在 abort 时 `disconnect()`。
- 跨页常驻的状态存在 `window` 上（如 `window.__cursor`）。body 被换掉后，在 `page-load` 里重新抓取元素、重挂运行时类（如 `custom-cursor`）。
- `astro:after-swap` 里补回 `<html>` 的 `.js` 类（ClientRouter 会重置 html 属性，否则依赖 `.js` 的动画——手绘线等——会失效）。

**Squiggle.astro**：区块标题下的手绘下划线，内置 4 条 SVG path（variant 0-3 或随机），`sq1` 左→右、`sq2` 右→左，靠 `stroke-dashoffset` 各画一次，由 `.section-head.draw` 触发；进出视口用独立 IntersectionObserver(threshold .6) 切 `.draw`，离开复位、回来重画。

---

## 这个站的定位（改动时请保持一致）

渲染方向技术美术，求职导向。核心是「三层证据」：
- **生产力（能上线）**：在产项目 + 专利 + 优化硬数字 —— 主线，由假室内、河水、优化类承载。
- **差异化**：AI 美术生产管线 —— 成长标签。
- **纵深**：对马岛草（个人作品）—— 证明从零造渲染管线的能力，但明确标为「个人作品」，不与在产工作混淆。

首页 hero 是第一人称自我介绍，定位语只讲渲染 + AI，不提个人项目。主打始终是在产 + 专利。

## 设计语言（改样式时的约束）

- **配色**：深色暖调，暖炭灰背景（非纯黑），低饱和青铜金 `--accent` 为主、墨绿 `--accent-2` 为辅。所有颜色/字体/圆角都是 `src/styles/global.css` 顶部的 CSS 变量，改气质从那里改。
- **字体**：圆润现代无衬线 Plus Jakarta Sans + 展示体 Clash Grotesk（CDN，加载失败回退）；等宽用 Space Mono。
- **质感**：弱边框（极淡描边 + 色块分层 + 柔阴影代替硬线），圆角偏大；背景细噪点 + 极淡暖光渐变（静态、不运动，避免死黑）；全局背景网格母题 `body::after`（固定层 + radial mask 渐隐，极淡不运动）。
- **方向色体系**：每个方向一个低饱和色（`--dir-渲染/特效/优化/动画/美术流程` 及 `-soft`），通过 `--c/--c-soft` 注入卡片与详情页。色彩有信息含义（区分方向），非装饰；改色只动顶部变量。贯穿：卡片顶部细条/hover 边框/方向标签、详情页方向名水印、正文小标记/职责边线/行内代码/引用线、筛选选中态、详情页流场侧栏。
- **动效克制**：① 首屏一次错峰入场（`.rise`）② 下方区块滚动进视口淡入一次即停（`.reveal` + IntersectionObserver，非持续动效）③ 卡片 hover 上浮 + 媒体微缩放 ④ 视频 hover 预览。**全站尊重 `prefers-reduced-motion`**（关动效后内容照常可见）。明确**不做**：持续运动的背景、流光扫光、动画渐变、对专利/数字的强调动效。

## 交互效果清单（当前实际效果，按文件）

**Base.astro（全站）**
- 顶部细滚动进度条 `.scroll-progress-bar`（2px，青铜→墨绿，`scaleX = scrollTop/(scrollHeight-clientHeight)`）。
- 自定义光标：实心点 + lerp 惯性跟随的描边环；hover 链接/卡片时变形。状态存 `window.__cursor`，跨页常驻。仅 `hover:hover` 且 ≥920px 启用，触屏/窄屏隐藏。
- 磁性按钮 `.btn / .nav-cta`：鼠标在按钮内时轻微吸附位移。
- 导航下划线从中间展开（`background-size` 动画）。

**index.astro（首页）**
- Hero「线框高度场」随鼠标做 lerp 视差漂移。
- 精选 `.featrail`：单行横向滚动，pointer 拖拽（仅左键，位移 >6px 才算拖动，拖后 `once` 吞一次 click，触屏走原生滚动，拦 `dragstart`）+ 滚轮横滑 + 右侧渐隐；卡片为「悬浮卡 + 顶部方向色细条」。头部提示「向右滑动」箭头（`.rail-swipe`，循环轻推）+ `SCROLL` 滑线。
- 卡片 3D 磁性倾斜 + 媒体内视差（hover 时按鼠标位置 rotateX/Y + 媒体反向位移）。
- 方向筛选：按 `data-dir` 显隐 + 切换淡入动画（`.card-enter/.card-exit`）。
- 两条母题分界线（错落对称）：上方 `.motif` 贴左，下方 `.motif-rev` 用 `scaleX(-1)` 左右镜像并 `margin-left:auto` 贴到最右；随鼠标反向轻微视差。`.motif{margin:8px 0}` 是有意靠边，**不要**改成 `auto`（会居中）。

**work/[id].astro（详情页）**
- 左右「流场侧栏」`.case-flow`：运行时 JS（`createElementNS`）生成多条顺流而下、彼此交织的流线（多层正弦位移）+ 顺流光点节点；**鼠标靠近时流线沿水平方向被推开**（`repelX`，半径/强度在脚本顶部 `R_REPEL/STR`）+ 整体 lerp 视差。左侧细窄贴边（避开目录），右侧略宽。仅 ≥1280px 显示，reduce-motion 下只渲染静态一帧。
- 目录 TOC：仅 ≥1400px 显示；IntersectionObserver 高亮当前小节。
- 方向名超大描边水印 `.case-watermark`（竖排、极低透明度）。

页面切换：ClientRouter 做淡入淡出过渡，作品媒体用 `transition:name={media-{id}}` 做共享元素过渡。

## 目录

- `src/content/projects/*.md` —— 作品内容，**作者日常只改这里**
- `src/content.config.ts` —— 作品字段定义（schema），加字段在这里
- `src/pages/index.astro` —— 首页（hero / 精选 / 全部+筛选 / 母题分界线 / 联系）
- `src/pages/work/[id].astro` —— 作品详情页（含流场侧栏 / 目录）
- `src/pages/about.astro` —— 关于页
- `src/components/ProjectCard.astro` —— 作品卡片
- `src/components/Squiggle.astro` —— 手绘下划线 SVG 组件
- `src/layouts/Base.astro` —— 全站框架（导航/字体/页脚/滚动进度条/自定义光标/磁性按钮/ClientRouter）
- `src/styles/global.css` —— 设计系统 + 全部样式
- `public/image` —— 封面/海报图；`public/resume.pdf` —— 简历；视频改放 Cloudflare R2（见下）

## 加 / 改一个作品

在 `src/content/projects/` 新建一个 `.md`，frontmatter 字段：

| 字段 | 必填 | 说明 |
|------|------|------|
| title | ✓ | 效果名 |
| project | ✓ | 所属项目；填「个人作品」会自动显示个人标签、隐藏「我负责」 |
| direction | ✓ | 枚举：渲染/特效/优化/动画/美术流程（决定首页筛选分类） |
| summary | ✓ | 卡片上的项目简介 1~2 句，硬数字/专利在这句里自然带出 |
| featured | | true 进首页精选 |
| order | | 排序，越小越靠前 |
| role | | 团队项目里你负责什么；留空详情页显示「待补」 |
| tags / video / cover / poster | | 媒体路径或 URL（见下） |

字段写错（如 direction 不在枚举、tags 不是数组）`npm run build` 会直接报错。

**媒体怎么填**：`video/cover/poster` 都是 `z.string()`，本地路径（如 `/image/xxx.jpg`，文件放 `public/`）或完整 URL 都可以。

**图片（cover / poster）留项目，不上 R2**：图片体积小（几十至一两百 KB），Pages 本身在 Cloudflare CDN，放仓库即可；Astro `<Image>` 优化只对 `src/` 目录生效，`public/` 图片原样输出——所以靠**导出前手动压缩**拿到等效收益，无需改项目结构。
- 文件放 `public/image/`，frontmatter 填 `/image/xxx.jpg`（无需域名前缀）。
- **导出规范**：cover 长边压到 ~800px；poster 保持视频同分辨率（720p = 1280×720）；格式 webp 或 jpg；单张目标 **<200KB**。
- poster 可以直接截视频某一帧，务必提供以避免视频加载前白屏。

**视频放 Cloudflare R2**，`video` 填完整 URL（当前域名 `https://video.maxpeng.dev/<文件名>.mp4`）：
- R2 建桶上传，开放公开访问（已绑自定义子域 `video.maxpeng.dev` 走 CDN 缓存）。
- `<video>` 直接播放跨域无需配 CORS；同名文件更新后在 Cloudflare Purge，或文件名带版本号。
- 按 720p / H.264 / 单个尽量 <8MB 压制。

## 待办（求职前必做）

1. **补各在产项目的 `role`**（个人职责）—— 现在详情页显示「待补」。求职向最关键。
2. **AI 管线那篇补工程厚度**：用了哪些工具 / 卡点 / 质量把控 / 提效数据 / 产出多少可用资产。
3. **补作品视频与封面**（放 R2，引用见上）；河水、布料在精选位但缺素材，优先补。
