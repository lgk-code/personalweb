import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const ignoredDirectories = new Set([".git", ".next", "node_modules", "coverage"]);
const textExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);

const secretPatterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /ghp_[A-Za-z0-9_]{20,}/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /BEGIN [A-Z ]*PRIVATE KEY/,
  /(password|api[_-]?key|token)\s*=\s*['"][^'"]+['"]/i,
];

const publicPathPatterns = [/\/home\/lgk\//, /\/mnt\/c\/Users\/logic\//, /D:\\/i];
const publicContentRoots = [path.join(root, "src"), path.join(root, "public")];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function isPublicContent(filePath) {
  return publicContentRoots.some((publicRoot) => filePath.startsWith(publicRoot));
}

function formatRelative(filePath) {
  return path.relative(root, filePath);
}

const files = await collectFiles(root);
const findings = [];

for (const file of files) {
  const fileStat = await stat(file);

  if (fileStat.size > 1024 * 1024) {
    continue;
  }

  const text = await readFile(file, "utf8");
  const patterns = [...secretPatterns];

  if (isPublicContent(file)) {
    patterns.push(...publicPathPatterns);
  }

  for (const pattern of patterns) {
    if (pattern.test(text)) {
      findings.push(`${formatRelative(file)} matched ${pattern}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Sensitive content scan failed:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Sensitive content scan passed (${files.length} text files checked).`);
