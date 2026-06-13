import { readFileSync } from "node:fs";
import path from "node:path";

const contentFiles = [
  "src/app/apple-icon.tsx",
  "src/app/icon.tsx",
  "src/app/layout.tsx",
  "src/app/not-found.tsx",
  "src/app/opengraph-image.tsx",
  "src/app/page.tsx",
  "src/lib/portfolio.ts",
  "src/lib/site.ts",
];
const redlines = [
  {
    label: "lorem ipsum filler",
    pattern: /lorem\s+ipsum/i,
  },
  {
    label: "placeholder copy",
    pattern: /\bplaceholder\b/i,
  },
  {
    label: "dummy copy",
    pattern: /\bdummy\b/i,
  },
  {
    label: "template copy",
    pattern: /\btemplate\b/i,
  },
  {
    label: "scaffold copy",
    pattern: /\bscaffold\b/i,
  },
  {
    label: "Chinese placeholder copy",
    pattern: /占位|假数据|模板|示例项目/,
  },
];

const violations = [];

for (const file of contentFiles) {
  const content = readFileSync(file, "utf8");

  for (const { label, pattern } of redlines) {
    if (pattern.test(content)) {
      violations.push(`${path.relative(process.cwd(), file)} contains ${label}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Content redline check failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Content redline check passed (${contentFiles.length} content source files checked)`);
