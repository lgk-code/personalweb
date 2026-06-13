import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const htmlPath = path.join(process.cwd(), ".next", "server", "app", "index.html");
const cssPath = path.join(process.cwd(), "src", "app", "globals.css");

function fail(message) {
  console.error(`Accessibility output check failed: ${message}`);
  process.exit(1);
}

function readRequiredFile(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing ${path.relative(process.cwd(), filePath)}`);
  }

  return readFileSync(filePath, "utf8");
}

function getTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "g")) ?? [];
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return match?.[1];
}

const html = readRequiredFile(htmlPath);
const css = readRequiredFile(cssPath);
const imageTags = getTags(html, "img");
const linkTags = html.match(/<a\b[^>]*>.*?<\/a>/g) ?? [];
const hashTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

const requiredFragments = [
  ['<html lang="zh-CN"', "document language must be set"],
  ["<main>", "page must expose a main landmark"],
  ['<nav class="top-nav" aria-label="主导航"', "top nav must have an accessible label"],
  ['<a class="skip-link" href="#projects">跳到项目</a>', "skip link must target projects"],
  ['id="projects"', "projects skip target must exist"],
  ['id="method"', "method section target must exist"],
  ['id="contact"', "contact section target must exist"],
  ['aria-labelledby="evidence-heading"', "evidence section must be labelled by a heading"],
  ['<h2 id="evidence-heading"', "evidence labelled heading must exist"],
  ['aria-label="关键证据"', "hero proof row must have an accessible label"],
  ['aria-label="AIFocus 技术栈"', "AIFocus stack list must have an accessible label"],
  ['aria-label="CodePath 技术栈"', "CodePath stack list must have an accessible label"],
  ['aria-labelledby="aifocus-project-title"', "AIFocus article must be labelled by its title"],
  ['id="aifocus-project-title"', "AIFocus article title id must exist"],
  ['aria-labelledby="codepath-project-title"', "CodePath article must be labelled by its title"],
  ['id="codepath-project-title"', "CodePath article title id must exist"],
];

for (const [fragment, message] of requiredFragments) {
  if (!html.includes(fragment)) {
    fail(message);
  }
}

for (const target of hashTargets) {
  if (!html.includes(`id="${target}"`)) {
    fail(`hash link target is missing: #${target}`);
  }
}

if (/tabindex="(?!0|-1)/i.test(html)) {
  fail("positive tabindex values are not allowed");
}

if (/role="button"/i.test(html)) {
  fail("links or generic elements must not impersonate buttons");
}

if (!/:focus-visible/.test(css) || !/outline\s*:/.test(css)) {
  fail("global CSS must include a visible keyboard focus outline");
}

if (!/prefers-reduced-motion:\s*reduce/.test(css)) {
  fail("CSS must respect reduced motion preferences");
}

if (imageTags.length < 4) {
  fail(`expected at least four images, found ${imageTags.length}`);
}

const emptyAltImages = imageTags.filter((tag) => getAttribute(tag, "alt") === "");
const describedImages = imageTags.filter((tag) => {
  const alt = getAttribute(tag, "alt");
  return typeof alt === "string" && alt.length > 0;
});

if (emptyAltImages.length !== 1) {
  fail(`expected one decorative image with empty alt text, found ${emptyAltImages.length}`);
}

if (!html.includes('<div class="hero-media" aria-hidden="true"><img alt=""')) {
  fail("the decorative empty-alt image must stay inside the aria-hidden hero media");
}

if (describedImages.length < 3) {
  fail("project images must keep descriptive alt text");
}

for (const tag of describedImages) {
  const alt = getAttribute(tag, "alt") ?? "";

  if (alt.length < 8) {
    fail(`image alt text is too terse: ${tag}`);
  }
}

for (const tag of linkTags) {
  if (/target="_blank"/.test(tag) && !/rel="[^"]*\bnoopener\b[^"]*\bnoreferrer\b/.test(tag)) {
    fail(`external new-tab link must include noopener and noreferrer: ${tag}`);
  }
}

console.log(
  `Accessibility output check passed (${imageTags.length} images, ${hashTargets.length} hash links)`
);
