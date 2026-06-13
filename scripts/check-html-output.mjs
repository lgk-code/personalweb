import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const htmlPath = path.join(process.cwd(), ".next", "server", "app", "index.html");
const notFoundHtmlPath = path.join(process.cwd(), ".next", "server", "app", "_not-found.html");

function fail(message) {
  console.error(`HTML output check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(htmlPath)) {
  fail(`missing ${path.relative(process.cwd(), htmlPath)}; run npm run build first`);
}

if (!existsSync(notFoundHtmlPath)) {
  fail(`missing ${path.relative(process.cwd(), notFoundHtmlPath)}; run npm run build first`);
}

const html = readFileSync(htmlPath, "utf8");
const notFoundHtml = readFileSync(notFoundHtmlPath, "utf8");
const combinedHtml = `${html}\n${notFoundHtml}`;
const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
const imagePreloads = html.match(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/g) ?? [];
const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
const h1Count = (html.match(/<h1\b/g) ?? []).length;

const requiredText = [
  "lgk-code",
  "AIFocus",
  "CodePath",
  "Evidence chain",
  "跳到项目",
  "application/ld+json",
  "https://schema.org",
  "github.com/lgk-code/codepath-extension/releases/latest",
  "github.com/lgk-code/codepath-extension/releases/latest/download/CodePath.zip",
  'rel="canonical"',
  'rel="manifest"',
  "/manifest.webmanifest",
  'rel="apple-touch-icon"',
  'meta name="application-name"',
  'meta name="theme-color"',
  'content="#151713"',
  'meta name="color-scheme"',
  'content="light"',
  'link rel="author"',
  'meta name="author"',
  'meta property="og:title"',
  'meta property="og:description"',
  'meta property="og:image"',
  'meta property="og:image:alt"',
  'meta name="twitter:card"',
  'meta name="twitter:title"',
  'meta name="twitter:image"',
  "现场记录",
  "我习惯把想法落到能跑、能看、能被追问的系统里",
  "每个项目都要能说清楚输入、处理和输出。",
];

const requiredAssets = [
  "/projects/hero-workbench.png",
  "/projects/aifocus-signal.png",
  "/projects/aifocus-signal-mobile.png",
  "/projects/codepath-browser.png",
  "/projects/codepath-panel-mobile.png",
  "/projects/codepath-mcp-comparison.png",
];

const requiredIds = ['id="projects"', 'id="method"', 'id="contact"', 'id="evidence-heading"'];
const requiredNotFoundText = ["这条路径还没被构建出来。", "返回首页"];
const htmlBudgets = [
  [htmlPath, 60_000],
  [notFoundHtmlPath, 25_000],
];

function hasAssetReference(asset) {
  return html.includes(asset) || html.includes(encodeURIComponent(asset));
}

if (h1Count !== 1) {
  fail(`expected exactly one h1, found ${h1Count}`);
}

for (const [filePath, maxBytes] of htmlBudgets) {
  const size = statSync(filePath).size;

  if (size > maxBytes) {
    fail(`${path.relative(process.cwd(), filePath)} is ${size} bytes, expected <= ${maxBytes}`);
  }
}

for (const text of requiredText) {
  if (!html.includes(text)) {
    fail(`missing required text: ${text}`);
  }
}

for (const asset of requiredAssets) {
  if (!hasAssetReference(asset)) {
    fail(`missing required asset reference: ${asset}`);
  }
}

for (const id of requiredIds) {
  if (!html.includes(id)) {
    fail(`missing required section marker: ${id}`);
  }
}

for (const text of requiredNotFoundText) {
  if (!notFoundHtml.includes(text)) {
    fail(`missing required not-found text: ${text}`);
  }
}

if (imageTags.length < 4) {
  fail(`expected at least four rendered images, found ${imageTags.length}`);
}

if (imagePreloads.length !== 1) {
  fail(`expected exactly one priority image preload, found ${imagePreloads.length}`);
}

if (!imagePreloads[0].includes("hero-workbench.png")) {
  fail("the only priority image preload must be the hero workbench asset");
}

if (!jsonLdMatch) {
  fail("missing JSON-LD script");
}

let jsonLd;
try {
  jsonLd = JSON.parse(jsonLdMatch[1]);
} catch (error) {
  fail(`invalid JSON-LD: ${error instanceof Error ? error.message : String(error)}`);
}

if (jsonLd["@type"] !== "Person" || jsonLd.name !== "lgk-code") {
  fail("JSON-LD must describe the public lgk-code person identity");
}

if (!Array.isArray(jsonLd.workExample) || jsonLd.workExample.length !== 2) {
  fail("JSON-LD must describe exactly two showcased work examples");
}

const aifocusWork = jsonLd.workExample.find((work) => work.name === "AIFocus");
const codePathWork = jsonLd.workExample.find((work) => work.name === "CodePath");

if (!aifocusWork || !codePathWork) {
  fail("JSON-LD work examples must include AIFocus and CodePath");
}

if ("url" in aifocusWork) {
  fail("AIFocus JSON-LD must not publish a private or unavailable URL");
}

if (codePathWork.url !== "https://github.com/lgk-code/codepath-extension/releases/latest") {
  fail("CodePath JSON-LD must point to the public release URL");
}

if (JSON.stringify(jsonLd).includes("undefined")) {
  fail("JSON-LD must not include undefined values");
}

for (const tag of imageTags) {
  if (!/\salt=/.test(tag)) {
    fail(`image is missing alt attribute: ${tag}`);
  }
}

if (!imageTags.some((tag) => tag.includes('alt="AIFocus'))) {
  fail("missing non-decorative AIFocus image alt text");
}

if (!imageTags.some((tag) => tag.includes('alt="CodePath'))) {
  fail("missing non-decorative CodePath image alt text");
}

if (!imageTags.some((tag) => tag.includes("CodePath MCP"))) {
  fail("missing non-decorative CodePath MCP image alt text");
}

if (
  /\/home\/lgk|API key|token|password|next\.svg|vercel\.svg|github\.com\/lgk-code\/AIFocus|github\.com\/lgk-code\/personalweb/i.test(
    combinedHtml
  )
) {
  fail("found sensitive, private, or scaffold-only text in rendered HTML");
}

console.log(
  `HTML output check passed (${imageTags.length} images, ${requiredText.length} content markers)`
);
