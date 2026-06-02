# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 命令

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/（字段类型错误会在此报错）
npm run preview  # 预览构建产物
```

## 技术架构

**数据流**：`src/content/projects/*.md` → Zod schema（`src/content.config.ts`）→ `getCollection('projects')` → 页面组件。

- `index.astro`：调用 `getCollection` 后按 `featured`/`order` 拆分两路数据，分别渲染精选轮播和全部网格。
- `work/[id].astro`：`getStaticPaths()` 构建期生成全部详情页；`render(entry)` 将 markdown body 转为 `<Content />` 组件。
- `ProjectCard.astro`：接收单条 entry 的 data，通过内联 `style="--c:var(--dir-{direction})"` 将方向色注入子元素，无需逐层传 prop。

**构建期 SVG 生成**（不是运行时 JS）：`index.astro` frontmatter 里用纯 JS 计算透视网格点+正弦位移，输出字符串插入 `<polyline points="">` — hero 右侧线框高度场、区块间 motif 点阵均是这个模式。调参在文件顶部的 `COLS/ROWS/W/H/MC/MR` 常量。

**客户端 JS 全在 `.astro` 文件的 `<script>` 块**，无外部 bundle：
- 精选拖拽：仅左键，位移 >6px 才算拖动（区分点击），用 `window` 上的 `pointermove/pointerup` 跟踪，拖动后 `once` 吞掉一次 click，触屏走原生滚动。
- 方向筛选：按 `data-dir` 属性显隐卡片。
- `IntersectionObserver` 有两种模式：`.reveal`（进入一次后停止观察）和 `.section-head`（进出视口切换 `.draw` 触发手绘线重播）。
- 滚动进度条：`Base.astro` 里 `scaleX = scrollTop / (scrollHeight - clientHeight)`。

**Squiggle.astro**：区块标题下的手绘下划线，内置 4 条 SVG path（variant 1-4 或随机），`sq1` 左→右，`sq2` 右→左，各靠 `stroke-dashoffset` 画出一次，由 `.section-head.draw` 触发。

---

## 项目说明（给 Claude Code / 也是给作者的备忘）

彭洋 Max Peng 的技术美术个人作品集站。Astro + Content Collections，纯 CSS，部署 Cloudflare Pages。

## 这个站的定位（改动时请保持一致）
渲染方向技术美术，求职导向。核心是「三层证据」：
- **生产力（能上线）**：在产项目 + 专利 + 优化硬数字 —— 主线，由假室内、河水、优化类承载。
- **差异化**：AI 美术生产管线 —— 成长标签。
- **纵深**：对马岛草（个人作品）—— 证明从零造渲染管线的能力，但明确标为「个人作品」，不与在产工作混淆。
首页 hero 是第一人称自我介绍，定位语只讲渲染 + AI，不提个人项目。主打始终是在产 + 专利。

## 设计语言（改样式时的约束）
- 深色暖调：暖炭灰背景（非纯黑），低饱和青铜金 `--accent` 为主强调、墨绿 `--accent-2` 为辅。
- 圆润现代无衬线（Plus Jakarta Sans + 展示体 Clash Grotesk），避免生硬。
- 弱边框：用极淡描边 + 色块分层 + 柔阴影代替硬线，圆角偏大。
- 背景有细噪点 + 极淡暖光氛围，避免死黑单调。
- 动效克制：①首屏一次错峰入场（.rise）②下方区块滚动进视口时淡入一次即停（.reveal+IntersectionObserver，非持续动效，关 JS 或开启系统"减少动态"时内容照常可见）③卡片 hover 上浮+媒体微缩放 ④视频 hover 预览。明确不做：持续运动的背景、流光扫光、动画渐变、对专利/数字的强调动效。
- 背景是静态的暖光渐变+细噪点（不运动），用于避免死黑，不分散注意力。
- Hero 两栏：左文字 + 右「线框高度场」视觉。该 SVG 在 index.astro 构建期用透视网格+正弦位移生成（COLS/ROWS/W/H 可调），是静态的、呼应顶点位移/地形/水面的视觉符号，无运行时 JS。
- Hero 背景有超大、描边、倾斜的「MAXPENG」名字水印（.hero-watermark），纯装饰、极低不透明度；手机端隐藏。
- 区块标题居中放大（只有「精选」「全部」「联系我」），带进场时从中间画开的下划线（.section-underline + drawline，一次性）。
- 方向色体系：每个方向一个低饱和色（CSS 变量 --dir-渲染/特效/优化/动画/美术流程 及其 -soft），ProjectCard 注入 --c/--c-soft，用于卡片顶部细条、hover 边框、方向标签——色彩有信息含义（区分方向），非装饰。改色只动顶部变量。
- 精选改为单行横向滚动（.featrail，scroll-snap + 滚轮横滑 + 左右渐隐 + 「横向滑动」提示）。
- 区块之间用极淡的点阵母题（.motif，构建期生成的轻起伏点阵+连线）填补留白，opacity 很低、不抢内容。
- 全局背景网格母题（body::after，固定层 + radial mask 渐隐），填充背景空白，极淡、不运动。改浓淡调该层 rgba 透明度。
- 精选拖拽滚动：容器 user-select:none + -webkit-user-drag:none，脚本拦 dragstart，并用位移阈值区分点击/拖动，避免拖拽时选中文字或拖出链接。
- 方向色贯穿详情页：work/[id].astro 注入 --c/--c-soft，标题后有超大描边的方向名水印（.case-watermark），正文小标记/职责边线/行内代码/引用线均用方向色；筛选选中态也按方向取色（.filter.active[data-filter=...]）。
- 全局背景网格母题（body::after，固定层 + radial mask 渐隐）。
- 精选为「悬浮卡片 + 拖拽滚动」：无外框、极淡底色 + 柔阴影 + 顶部方向色细条；底部滚动条隐藏，靠 pointer 拖拽（index.astro 脚本）+ 滚轮横滑；右侧渐隐暗示更多，左侧不遮挡首卡；提示「按住卡片拖动浏览」。
- 所有颜色/字体/圆角都是 `src/styles/global.css` 顶部的 CSS 变量，改气质从那里改。

## 目录
- `src/content/projects/*.md` —— 作品内容，**作者日常只改这里**
- `src/content.config.ts` —— 作品字段定义（schema），加字段在这里
- `src/pages/index.astro` —— 首页（hero / 精选 / 全部+筛选）
- `src/pages/work/[id].astro` —— 作品详情页
- `src/pages/about.astro` —— 关于页
- `src/components/ProjectCard.astro` —— 作品卡片
- `src/components/Squiggle.astro` —— 手绘下划线 SVG 组件
- `src/layouts/Base.astro` —— 全站框架（导航/字体/页脚/滚动进度条）
- `src/styles/global.css` —— 设计系统
- `public/video`、`public/image` —— 放素材；`public/resume.pdf` —— 简历

## 加 / 改一个作品
在 `src/content/projects/` 新建一个 `.md`，frontmatter 字段：
| 字段 | 必填 | 说明 |
|------|------|------|
| title | ✓ | 效果名 |
| project | ✓ | 所属项目；填「个人作品」会自动显示金色角标、隐藏「我负责」 |
| direction | ✓ | 枚举：渲染/特效/优化/动画/美术流程（决定首页筛选分类） |
| summary | ✓ | 卡片上的项目简介 1~2 句，硬数字/专利在这句里自然带出 |
| featured | | true 进首页精选 |
| order | | 排序，越小越靠前 |
| role | | 团队项目里你负责什么；留空详情页显示「待补」 |
| tags / video / cover / poster | | 媒体放 public/，路径要对上 |
字段写错（如 direction 不在枚举、tags 不是数组）`npm run build` 会直接报错。

## 待办（求职前必做）
1. 补各在产项目的 `role`（个人职责）—— 现在详情页显示「待补」。
2. AI 管线那篇补工程厚度：用了哪些工具 / 卡点 / 质量把控 / 提效数据 / 产出多少可用资产。
3. 放入作品视频与封面（见 public/video/README.txt）；河水、布料目前在精选位但缺素材，优先补。
4. 视频压到 720p、H.264、单个 <8MB，量大改用对象存储/视频服务再引用。
5. 部署：推 GitHub → Cloudflare Pages 连仓库，构建命令 `npm run build`、输出目录 `dist`；改 astro.config.mjs 的 site 为正式域名。

## 本轮更新（设计第 N 版）
- 修复精选拖拽误拦点击：脚本用 dragged 布尔（位移>6px 才算拖动）区分点击/拖动，纯点击正常进卡片。
- 个人作品标签从右上角角标改为行内标签（meta-personal，前缀「类型」），与项目/方向标签同排；移除 .badge。
- 详情页去掉方向名水印（.case-watermark 已删），方向色仍贯穿标签/小标记/职责边线/代码/引用。
- Hero 背景更大胆：新增等高线地形场（.hero-topo，index.astro 的 contour() 构建期生成同心高程环，静态），并加强青铜辉光 + 暗角（body background-image）。地形层浓淡在各 path 的 opacity 与 .hero-topo 的 mask；移动端隐藏。

## 设计迭代（最新）
- 移除等高线地形层（杂乱、无设计感）。
- 精选拖拽：去掉 setPointerCapture（它会改写事件目标、吞掉卡片的 click，是之前点击进不去的根因）；改用 window 上的 pointermove/up 跟踪，仅鼠标左键启用，触屏走原生滚动；拖动后只 once 吞掉一次 click。纯点击正常进入详情页（已用语义点击验证）。
- 空旷处加设计元素（不叠加在已有元素上）：右侧线框包了「视口取景框」——四角取景括号 + 等宽坐标标签（HEIGHTFIELD.01 / VTX·DISPLACE，.viewport/.vp-corner/.vp-label）；首屏左下角加滚动指示 .hero-scroll（SCROLL + 一段循环滑动的短线，唯一的循环动效，尊重 reduce-motion）。移动端均隐藏。

## 留白处小标注（最新）
- 去掉视口取景框内的 HEIGHTFIELD/VTX 文字标签（首屏不再空旷，无需再加）；四角括号保留。
- SCROLL 提示从首屏底部移到精选区头部右侧，并配 01/5 计数（随横向滚动更新，#rail-count），紧贴卡片，明确指向可横滑。
- 在下方留白处增加等宽小标注填充：母题分隔两端 — grid.field / x:1100·y:150；全部区「共 N 个项目 — 按方向筛选」；收尾区 // END·LET'S TALK。均极淡、克制，移动端按需隐藏。

## 留白处装饰（修正思路·最新）
- 撤掉所有贴在已有元素上的小标注（取景框四角括号、母题两端文字、全部区计数、收尾标记）——那是错误思路。
- 改为在真正空旷的左右边距放独立固定侧栏（Base.astro 的 .siderail，仅 ≥1280px 宽屏显示，不与居中内容重叠）：左=竖排邮箱 + 细线；右=竖排 TECHNICAL ARTIST + 滚动进度点（#scroll-dot 随页面滚动沿竖线移动）。
- 保留：精选区头部的 SCROLL 提示 + 01/N 计数（用户认可）。
- 继续加这类元素时遵循原则：放在空旷处、独立成立，不要往已有元素旁边贴。

## 滚动进度（最新替代方案）
- 撤掉竖排侧栏（竖排字母别扭、竖线悬空在 2/3 处）。
- 改为顶部细进度条 .scroll-progress-bar（固定在视口顶边，2px，青铜→墨绿渐变，随滚动 scaleX 填充）。无竖排文字、不悬空，占用顶边这片本就空的位置。脚本在 Base.astro。
- 精选区头部的 SCROLL + 01/N 计数保留。

## 手绘俏皮元素（最新方向）
- 参考 satnaing：标题下的规整直线下划线，换成手绘马克笔波浪线（components/Squiggle.astro，内置 4 条不同笔触，variant 指定或随机），进场时用 stroke-dashoffset 像被画出来一样描绘。精选/全部/联系我各用不同 variant，做到「每次不一样」。
- 待定（已和用户确认方向后再加）：关键词手绘圈选、空白处手绘小涂鸦（星号/箭头）。
- 原 .section-underline 直线已废弃。

## 手绘元素（完整版·最新）
- 手绘下划线 Squiggle：曲折改平缓（起伏更小），并用两条笔触交替 sq-loop1/sq-loop2 来回重画（像有人不停在描）；进场先画一条，之后循环。尊重 reduce-motion。
- 关键词圈选 Circle.astro：手绘椭圆圈住首屏简介里「能上线的工程级效果」，进场描绘出现。
- 手绘小涂鸦 Doodle.astro（spark/arrow/star/swirl）：名字旁火花、收尾区小星，点缀空白、不泛滥。
- 调参：笔触平缓度在 Squiggle 的 sets[] 控制点；来回速度在 sq-loop 的 3.2s；涂鸦类型用 Doodle type 属性。

## 手绘线（按 satnaing 重做·最新）
- 移除关键词圈选(Circle)与小涂鸦(Doodle)，只保留手绘下划线。
- Squiggle 改为两条上下靠近、不重叠的平缓笔触：sq1 路径左→右书写，sq2 路径右→左书写；CSS 用 stroke-dashoffset 让 sq1 左→右画出、sq2 随后右→左画出，各画一次。
- 触发方式：滚动进入视口时（.section-head.in，IntersectionObserver 加 .in 后不再移除）只播一次，之后静止——不再循环/常驻动。
- 调参：笔触形状在 Squiggle 的 sets[]；两条间距由 top(y≈6-8)/bot(y≈14-17) 控制；先后间隔在 CSS 两条 animation 的 delay(.05s/.5s)。

## 手绘线微调（最新）
- 触发改为每次进入视口重画：section-head 用独立 IntersectionObserver(threshold .6)切换 .draw 类（进出视口加/removed），动画由 .section-head.draw 驱动，离开复位、回来重画。内容淡入 .reveal 仍只播一次。
- 两条线间距收窄：Squiggle sets[] 的 top(y≈8-10)/bot(y≈13-14)。
