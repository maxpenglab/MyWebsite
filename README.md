# 彭洋 Max Peng · 技术美术作品集

渲染方向技术美术个人站。Astro + Content Collections，纯 CSS，深色暖调设计。

## 跑起来（需 Node 18+）
```bash
npm install
npm run dev      # 本地预览 http://localhost:4321
npm run build    # 生成静态站到 dist/
```

## 改内容（你日常只动这里）
每个作品 = `src/content/projects/` 下一个 .md 文件。加作品就新建、删就删文件。
字段说明见 CLAUDE.md。用 Claude Code 打开本项目可直接对话式修改，它会读 CLAUDE.md 拿到全部背景。

## 部署 Cloudflare Pages
推 GitHub → Pages 连仓库，构建命令 `npm run build`，输出目录 `dist`。

详细设计意图、字段表、待办清单都在 **CLAUDE.md**。
