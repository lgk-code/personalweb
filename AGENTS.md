# personalweb Agent Guide

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project North Star

- 这是 `lgk-code` 的个人网站。目标是展示真实的人、真实的作品和真实的判断力，不做通用模板站。
- 第一屏必须直接让访问者理解：我是谁、我在做什么、我做过什么；不能只放抽象口号或装饰性视觉占位。
- 默认把 `/home/lgk/projects/AIFocus` 和 `/home/lgk/projects/CodePath` 作为重点项目展示素材来源。
- 展示内容必须基于真实项目事实。不要夸大功能、虚构指标、伪造用户、伪造截图或把未完成能力写成已完成。

## Documentation Boundaries

- `README.md` 写安装、运行、验证、资产和公开项目事实。
- `docs/DECISIONS.md` 写稳定决策；`docs/ROADMAP.md` 写当前状态、下一步和已知缺口；`docs/REVIEW-RUBRIC.md` 写三 Agent 终审细则。
- `AGENTS.md` 只保留下次 agent 开发时必须遵守的规则、边界和命令指针。随着代码和协作方式演进，可以主动编辑、压缩、重组或删除已经过时的内容。
- 会话上下文使用量超过 75% 后，先使用 `/neat`（neat-freak）对齐项目文档和当前状态，再压缩上下文。

## Development Rules

- 默认使用 Next.js、TypeScript、React 和手写 CSS；除非用户明确改变技术方向。
- 开始改 Next.js 代码前，先阅读 `node_modules/next/dist/docs/` 里与本次改动相关的指南。
- 默认做最小可行、可运行、可截图、可评审的纵向切片；不要为了当前任务引入复杂抽象。
- 使用相邻项目素材前，先确认项目描述、技术栈和当前公开能力。读取相邻项目时默认只读，不修改、不格式化、不迁移。
- 如果需要了解本机 Windows/WSL、Node、Python、Docker、模型网关或其他环境细节，再读取 `/mnt/c/Users/logic/.codex/ENVIRONMENT.md`。
- 在 Windows/UNC 工作区里运行项目命令时，走 WSL shell，避免误用 Windows 侧 `npm`：
  `wsl -d Ubuntu-24.04 --cd /home/lgk/projects/personalweb -- bash -lc '<command>'`
- 发现无关问题可以提醒，但不要顺手修复。不得覆盖用户已有改动。

## Design And Content

- 整体审美要像为本人定制的个人作品现场，不像 SaaS 模板、简历模板或组件库演示页。
- 页面应使用真实内容、真实项目、真实截图或可信的生成视觉资产；不要用空泛图标、假数据和 stock 感占位图撑场面。
- 信息层级要锋利：首屏建立身份和方向，项目区说明价值和证据，细节区展示能力结构与联系方式。
- 动效要克制，服务叙事、空间、状态变化或项目理解；不能为了炫技牺牲可读性和性能。
- 桌面和移动端都必须是完整体验。移动端不能出现遮挡、溢出、文字压缩、按钮难点或首屏主体缺失。
- 保持可访问性：语义结构清楚，颜色对比可读，键盘可达，图片有合理替代文本，动画尊重用户的减少动态偏好。

## Verification

- 完成代码或 UI 改动前，必须运行能覆盖本次改动的最小有效验证。
- 对 Next.js/TypeScript 改动，优先运行 `npm run quality`；若只跑局部命令，说明覆盖范围和剩余风险。
- UI 改动完成后，默认启动本地站点并给出访问地址。
- 交付前必须使用真实浏览器查看页面，至少覆盖桌面和移动端视口，并保存或说明截图检查结果。
- 完整交付必须通过三 Agent 终审：见 `docs/REVIEW-RUBRIC.md`。三个评分均需大于或等于 90，且没有红线。

## Safety Boundaries

- 不要把凭据、密钥、token、密码、私有配置、浏览器 profile、本机私密路径或未公开数据写入项目文件、文档、提交记录、页面内容或截图。
- 不要修改 `/home/lgk/projects/AIFocus`、`/home/lgk/projects/CodePath` 或其他相邻项目，除非用户明确要求。
- 不要提交依赖目录、构建缓存、临时截图中的敏感信息或本机工具配置。
- 不要在公开页面渲染尚未公开或会返回 404 的仓库链接；仓库绑定事实留在 README 和 docs。
- 不确定某个命令是否会破坏数据时，先停下来说明风险，不使用破坏性 git 或文件操作。
