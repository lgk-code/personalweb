import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const htmlPath = path.join(process.cwd(), ".next", "server", "app", "index.html");

function fail(message) {
  console.error(`HTML output check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(htmlPath)) {
  fail(`missing ${path.relative(process.cwd(), htmlPath)}; run npm run build first`);
}

const html = readFileSync(htmlPath, "utf8");
const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
const h1Count = (html.match(/<h1\b/g) ?? []).length;

const requiredText = [
  "lgk-code",
  "AIFocus",
  "CodePath",
  "Evidence chain",
  "application/ld+json",
  "https://schema.org",
  "每个项目都要能说清楚输入、处理和输出。",
];

const requiredAssets = [
  "/projects/hero-workbench.png",
  "/projects/aifocus-signal.png",
  "/projects/codepath-browser.png",
];

const requiredIds = ['id="projects"', 'id="method"', 'id="contact"', 'id="evidence-heading"'];

function hasAssetReference(asset) {
  return html.includes(asset) || html.includes(encodeURIComponent(asset));
}

if (h1Count !== 1) {
  fail(`expected exactly one h1, found ${h1Count}`);
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

if (imageTags.length < 3) {
  fail(`expected at least three rendered images, found ${imageTags.length}`);
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

if (/\/home\/lgk|API key|token|password|next\.svg|vercel\.svg/i.test(html)) {
  fail("found sensitive, private, or scaffold-only text in rendered HTML");
}

console.log(
  `HTML output check passed (${imageTags.length} images, ${requiredText.length} content markers)`
);
