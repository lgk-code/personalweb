import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  agents: "AGENTS.md",
  readme: "README.md",
  roadmap: path.join("docs", "ROADMAP.md"),
  decisions: path.join("docs", "DECISIONS.md"),
  rubric: path.join("docs", "REVIEW-RUBRIC.md"),
  workflow: path.join(".github", "workflows", "quality.yml"),
  packageJson: "package.json",
};

function fail(message) {
  console.error(`Project docs check failed: ${message}`);
  process.exit(1);
}

function readRequiredFile(relativePath) {
  const absolutePath = path.join(root, relativePath);

  if (!existsSync(absolutePath)) {
    fail(`missing ${relativePath}`);
  }

  return readFileSync(absolutePath, "utf8");
}

function requireFragments(label, content, fragments) {
  for (const fragment of fragments) {
    if (!content.includes(fragment)) {
      fail(`${label} is missing required fragment: ${fragment}`);
    }
  }
}

const agents = readRequiredFile(files.agents);
const readme = readRequiredFile(files.readme);
const roadmap = readRequiredFile(files.roadmap);
const decisions = readRequiredFile(files.decisions);
const rubric = readRequiredFile(files.rubric);
const workflow = readRequiredFile(files.workflow);
const packageJson = readRequiredFile(files.packageJson);

requireFragments("AGENTS.md", agents, [
  "`AGENTS.md` 只保留下次 agent 开发时必须遵守的规则",
  "主动编辑、压缩、重组或删除已经过时的内容",
  "超过 75%",
  "/neat",
  "AIFocus",
  "CodePath",
  "真实浏览器",
  "桌面和移动端",
  "docs/REVIEW-RUBRIC.md",
  "三 Agent 终审",
  "大于或等于 90",
]);

requireFragments("README.md", readme, [
  "https://github.com/lgk-code/personalweb",
  "npm run check:docs",
  "npm run quality",
  "真实浏览器桌面/移动截图验证",
  "docs/REVIEW-RUBRIC.md",
]);

requireFragments("docs/ROADMAP.md", roadmap, [
  "Current State",
  "Next Work",
  "docs/REVIEW-RUBRIC.md",
  "npm run quality",
]);

requireFragments("docs/DECISIONS.md", decisions, [
  "lgk-code/personalweb",
  "https://github.com/lgk-code/personalweb.git",
  "AIFocus",
  "CodePath",
  "npm run quality",
]);

requireFragments("docs/REVIEW-RUBRIC.md", rubric, [
  "真实浏览器桌面/移动截图",
  "重度 Vibe Coder",
  "原生审美设计师",
  "破坏性质量官",
  "90",
  "红线",
]);

requireFragments(".github/workflows/quality.yml", workflow, [
  "actions/checkout@v6",
  "actions/setup-node@v6",
  "node-version: 22",
  "npm run quality",
]);
requireFragments("package.json", packageJson, ['"check:docs"', "check-project-docs.mjs"]);

console.log("Project docs check passed (5 docs, workflow, package metadata)");
