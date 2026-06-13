# personalweb

`personalweb` 是 `lgk-code` 的个人网站项目，绑定仓库：

```text
https://github.com/lgk-code/personalweb
```

当前版本是一个 Next.js / TypeScript / 手写 CSS 个人首页切片，重点展示两个真实项目：

- **AIFocus**：AI 信息精选、日报、RSS、REST API 和 Agent Skill 接入平台。
- **CodePath**：面向 GitHub 源码阅读的 WXT / React / TypeScript 浏览器扩展。

## 开发

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

访问：

```text
http://localhost:3000
```

## 部署 URL

生产环境优先通过 `NEXT_PUBLIC_SITE_URL` 指定公开站点地址；未设置时会依次使用 Vercel 自动注入的生产/预览地址，本地开发优先回退到 `http://localhost:$PORT`，未设置 `PORT` 时使用 `http://localhost:3000`。`/robots.txt`、`/sitemap.xml` 和分享图 metadata 都使用同一套解析逻辑。

## 验证

```bash
npm test
npm run lint
npm run build
npm run check:assets
npm run check:design
npm run check:contrast
npm run check:asset-privacy
npm run check:html
npm run check:routes
npm run check:a11y
npm run check:links
npm run check:audit
npm run scan:secrets
npm run quality
```

当前测试覆盖公开身份、项目展示事实、站点 URL 解析、metadata routes 和关键 PNG/ICO 视觉资产，避免 AIFocus / CodePath 描述失真、站点 metadata 跑偏或资产被误替换。
`npm run check:assets` 会重新生成关键 PNG，并确认仓库里的生成结果没有漂移。
`npm run check:design` 会扫描设计红线，例如 viewport 字体缩放、渐变/orb/bokeh 装饰、默认脚手架素材和负 letter-spacing。
`npm run check:contrast` 会静态检查主要文字/背景配色，要求核心文本组合满足 WCAG AA 常规文本对比度。
`npm run check:asset-privacy` 会扫描公开图片/图标中的可打印元数据，避免本机路径或凭据关键词混入资产。
`npm run check:html` 会在生产构建后检查首页静态 HTML 的主标题、关键章节、图片 alt、核心资产和敏感/模板痕迹。
`npm run check:routes` 会在生产构建后检查 App Router manifest，确保主页、404、图标、OG、robots 和 sitemap 都保持静态输出。
`npm run check:a11y` 会在生产构建后检查主 landmark、跳转链接、导航标签、焦点样式、图片 alt 和 reduced-motion 兜底。
`npm run check:links` 会在生产构建后检查首页公开 HTTPS 链接是否在 allowlist 内，并禁止渲染尚未公开的项目仓库链接。
`npm run check:audit` 会运行 npm audit，要求 moderate 及以上漏洞为 0。
`npm run quality` 会串联资产同步、测试、lint、设计红线、对比度检查、公开资产隐私扫描、构建、HTML 输出检查、路由输出检查、可访问性检查、公开链接检查、敏感信息扫描和 audit 检查。

GitHub Actions 会在 `main` push 和 pull request 上运行同一套质量门禁。

首页包含 JSON-LD 结构化数据，用于描述 `lgk-code`、AIFocus 和 CodePath 的公开关系。

## 资产

```bash
npm run assets:generate
```

该命令会生成：

- `public/projects/aifocus-signal.png`：AIFocus 项目展示图。
- `public/projects/aifocus-signal-mobile.png`：AIFocus 移动端竖版展示图。
- `public/projects/codepath-panel-mobile.png`：CodePath 移动端侧栏聚焦裁剪图。
- `public/projects/hero-workbench.png`：由 AIFocus 视觉和 CodePath 截图合成的首屏背景图。
- `src/app/favicon.ico`：自有 `lgk` favicon，避免保留脚手架默认图标。

CodePath 项目展示使用相邻项目中已有的公开截图，并将含本机路径的 MCP 原图裁剪为只保留公开对比表的 `public/projects/codepath-mcp-comparison.png`。

站点还包含基于 `next/og` 生成的 `/icon` 和 `/opengraph-image` PNG 路由，用于浏览器标签页和分享预览。

## 素材边界

- 可以读取 `/home/lgk/projects/AIFocus` 和 `/home/lgk/projects/CodePath` 提取展示事实。
- 默认不得修改相邻项目。
- 不要把 API key、token、密码、私有配置或本机隐私路径写入页面、文档或提交记录。

## 质量门禁

完整交付前需要补齐真实浏览器桌面/移动截图验证，并按 `AGENTS.md` 要求运行三 Agent 终审：重度 vibe coder、原生审美设计师、破坏性质量官，全部评分大于或等于 90 且无红线。
具体评分口径见 `docs/REVIEW-RUBRIC.md`。
