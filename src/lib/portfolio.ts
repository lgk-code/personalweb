export type Project = {
  name: string;
  role: string;
  summary: string;
  evidence: string[];
  stack: string[];
  links: {
    label: string;
    href: string;
  }[];
};

export const portfolio = {
  identity: {
    handle: "lgk-code",
    tagline: "AI 产品与工程系统的个人现场",
    description:
      "我把信息筛选、代码阅读和 agent 工作流做成可运行的产品：先保护注意力，再放大判断力。",
  },
  heroProofPoints: [
    "AIFocus 把 AI 信息过载压缩成精选、日报、RSS、API 和 Skill",
    "CodePath 把 GitHub 仓库阅读变成侧边栏里的项目理解路径",
    "personalweb 用真实构建、公开截图和多角色评审收尾",
  ],
  projects: [
    {
      name: "AIFocus",
      role: "AI 信息精选与 Agent 接入平台",
      summary:
        "AIFocus 面向 AI 从业者、内容创作者、研究者和 Agent 用户，把高噪声 AI 信息流处理成可读、可搜、可订阅、可被 Agent 调用的精选服务。",
      evidence: [
        "覆盖精选信息流、全部 AI 动态、AI 日报、搜索筛选、RSS、REST API 和 Skill 接入",
        "使用信源抓取、AI 相关性预筛、摘要分类、多维评分、事件聚类和主条选择形成处理链路",
        "当前形态包含 Next.js 前台与独立 FastAPI 后端，worker 负责抓取、处理、模型评分、embedding 和日报生成",
      ],
      stack: ["Next.js", "FastAPI", "Postgres", "Redis/arq", "OpenAI-compatible models"],
      links: [],
    },
    {
      name: "CodePath",
      role: "GitHub 源码阅读浏览器扩展",
      summary:
        "CodePath 是面向 GitHub 源码阅读的浏览器扩展，在仓库页面注入侧边栏，帮助用户理解项目结构、技术栈、功能路径、当前文件和后续追问。",
      evidence: [
        "支持项目概览、功能路径分析、当前文件解释、连续追问和推荐问题",
        "兼容 OpenAI Chat Completions 风格模型接口，并支持 Anthropic 格式识别",
        "具备 Markdown 渲染、源码路径链接、流式输出探测、缓存状态和连接诊断",
      ],
      stack: ["WXT", "React", "TypeScript", "MCP", "Browser extension"],
      links: [
        {
          label: "Latest release",
          href: "https://github.com/lgk-code/codepath-extension/releases/latest",
        },
      ],
    },
  ] satisfies Project[],
  workingStyle: [
    "先把模糊目标收束成可运行切片",
    "用工程化验证把 vibe 变成可复现质量",
    "让 agent、工具和人各做自己最擅长的部分",
  ],
  contactHeading: "看公开代码与 release；如果方向对味，就从一个具体系统聊起。",
  evidenceChains: [
    {
      label: "AIFocus",
      title: "从高噪声信源到可消费的信息产品",
      body: "T1 / T1.5 / T2 信源进入抓取、AI 相关性预筛、标题摘要分类、多维评分、事件聚类和主条选择，最后输出 Web、RSS、REST API 和 Skill。",
    },
    {
      label: "CodePath",
      title: "从 GitHub 仓库到可追问的源码理解路径",
      body: "浏览器侧栏覆盖项目概览、功能路径、当前文件解释、连续追问和推荐问题；MCP Server 则把同一套分析能力交给 OpenClaw 兼容 agent。",
    },
    {
      label: "personalweb",
      title: "从作品材料到可审查的个人网站",
      body: "页面只使用可公开事实和生成/公开截图，配合测试、lint、构建、敏感信息扫描、真实截图和三角色终审作为交付闭环。",
    },
  ],
};
