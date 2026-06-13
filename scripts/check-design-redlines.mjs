import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const roots = ["src", "public", "scripts"];
const textExtensions = new Set([".css", ".tsx", ".ts", ".md", ".mjs"]);
const redlines = [
  {
    name: "font-size must not scale with viewport width",
    pattern: /font-size\s*:[^;]*vw/i,
  },
  {
    name: "avoid gradient decoration",
    pattern: /linear-gradient|radial-gradient|conic-gradient/i,
  },
  {
    name: "avoid orb or bokeh decoration",
    pattern: /\b(orb|orbs|bokeh)\b/i,
  },
  {
    name: "avoid default scaffold asset references",
    pattern: /next\.svg|vercel\.svg/i,
  },
  {
    name: "avoid negative letter spacing",
    pattern: /letter-spacing\s*:\s*-/i,
  },
];

function listFiles(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      files.push(...listFiles(absolutePath));
    } else if (textExtensions.has(path.extname(absolutePath))) {
      files.push(absolutePath);
    }
  }

  return files;
}

const files = roots.flatMap((root) => listFiles(path.join(process.cwd(), root)));
const ignoredFiles = new Set(["scripts/check-design-redlines.mjs"]);
const violations = [];

for (const file of files) {
  if (ignoredFiles.has(path.relative(process.cwd(), file))) {
    continue;
  }

  const content = readFileSync(file, "utf8");

  for (const redline of redlines) {
    if (redline.pattern.test(content)) {
      violations.push({
        file: path.relative(process.cwd(), file),
        redline: redline.name,
      });
    }
  }
}

if (violations.length > 0) {
  console.error("Design redline check failed:");
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.redline}`);
  }
  process.exit(1);
}

console.log(`Design redline check passed (${files.length} files checked)`);
