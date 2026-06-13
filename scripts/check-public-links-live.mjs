import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const htmlPath = path.join(process.cwd(), ".next", "server", "app", "index.html");
const timeoutMs = 15_000;

function fail(message) {
  console.error(`Live public link check failed: ${message}`);
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

if (links.length === 0) {
  fail("expected at least one public HTTPS link in the rendered homepage");
}

async function fetchWithTimeout(url, method) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "user-agent": "personalweb-link-check/0.1",
    },
  });
}

async function checkLink(link) {
  let response = await fetchWithTimeout(link, "HEAD");

  if (response.status === 405 || response.status === 403) {
    response = await fetchWithTimeout(link, "GET");
  }

  if (!response.ok) {
    fail(`${link} returned ${response.status}`);
  }

  return {
    link,
    status: response.status,
    finalUrl: response.url,
  };
}

const results = [];

for (const link of links) {
  try {
    results.push(await checkLink(link));
  } catch (error) {
    fail(`${link} could not be reached: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(
  `Live public link check passed (${results.length} links: ${results
    .map(({ status, finalUrl }) => `${status} ${finalUrl}`)
    .join("; ")})`
);
