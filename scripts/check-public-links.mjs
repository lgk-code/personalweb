import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const htmlPath = path.join(process.cwd(), ".next", "server", "app", "index.html");

function fail(message) {
  console.error(`Public link check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(htmlPath)) {
  fail(`missing ${path.relative(process.cwd(), htmlPath)}; run npm run build first`);
}

const html = readFileSync(htmlPath, "utf8");
const links = [
  ...new Set(
    [...html.matchAll(/<a\b[^>]*\shref="(https:\/\/[^"]+)"/g)].map((match) => match[1])
  ),
];
const allowedLinks = new Set([
  "https://github.com/lgk-code",
  "https://github.com/lgk-code/codepath-extension/releases/latest",
  "https://github.com/lgk-code/codepath-extension/releases/latest/download/CodePath.zip",
]);

if (links.length === 0) {
  fail("expected at least one public HTTPS link in the rendered homepage");
}

const unexpectedLinks = links.filter((link) => !allowedLinks.has(link));

if (unexpectedLinks.length > 0) {
  fail(`unexpected rendered public link(s): ${unexpectedLinks.join(", ")}`);
}

for (const link of links) {
  if (/github\.com\/lgk-code\/(?:AIFocus|personalweb)\b/i.test(link)) {
    fail(`private or not-yet-public repository link rendered: ${link}`);
  }
}

console.log(`Public link check passed (${links.length} allowlisted links)`);
