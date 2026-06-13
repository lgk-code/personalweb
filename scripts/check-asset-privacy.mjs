import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const roots = ["public", path.join("src", "app")];
const binaryExtensions = new Set([".ico", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);
const sensitivePatterns = [
  {
    label: "local Linux path",
    pattern: /\/home\/lgk\//i,
  },
  {
    label: "local Windows path",
    pattern: /C:\\Users\\logic\\/i,
  },
  {
    label: "project absolute path",
    pattern: /\/mnt\/c\/Users\/logic\//i,
  },
  {
    label: "OpenAI-style key",
    pattern: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/i,
  },
  {
    label: "credential label",
    pattern: /\b(api[_-]?key|password|secret|token)\b/i,
  },
];

function fail(message) {
  console.error(`Asset privacy check failed: ${message}`);
  process.exit(1);
}

function listFiles(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      files.push(...listFiles(absolutePath));
    } else if (binaryExtensions.has(path.extname(absolutePath).toLowerCase())) {
      files.push(absolutePath);
    }
  }

  return files;
}

const files = roots.flatMap((root) => listFiles(path.join(process.cwd(), root)));
const violations = [];

for (const file of files) {
  const printableStrings = readFileSync(file, "latin1").match(/[ -~]{4,}/g) ?? [];
  const joinedStrings = printableStrings.join("\n");

  for (const { label, pattern } of sensitivePatterns) {
    if (pattern.test(joinedStrings)) {
      violations.push(`${path.relative(process.cwd(), file)} contains ${label}`);
    }
  }
}

if (violations.length > 0) {
  fail(violations.join("\n"));
}

console.log(`Asset privacy check passed (${files.length} binary/public asset files checked)`);
