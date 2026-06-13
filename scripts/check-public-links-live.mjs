import { existsSync, readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const htmlPath = path.join(process.cwd(), ".next", "server", "app", "index.html");
const notFoundHtmlPath = path.join(process.cwd(), ".next", "server", "app", "_not-found.html");
const execFileAsync = promisify(execFile);
const timeoutSeconds = 20;

function fail(message) {
  console.error(`Live public link check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(htmlPath)) {
  fail(`missing ${path.relative(process.cwd(), htmlPath)}; run npm run build first`);
}

if (!existsSync(notFoundHtmlPath)) {
  fail(`missing ${path.relative(process.cwd(), notFoundHtmlPath)}; run npm run build first`);
}

const html = `${readFileSync(htmlPath, "utf8")}\n${readFileSync(notFoundHtmlPath, "utf8")}`;
const links = [
  ...new Set(
    [...html.matchAll(/<a\b[^>]*\shref="(https:\/\/[^"]+)"/g)].map((match) => match[1])
  ),
];

if (links.length === 0) {
  fail("expected at least one public HTTPS link in the rendered homepage");
}

async function curlLink(link, method) {
  const args = [
    "--silent",
    "--show-error",
    "--location",
    "--max-time",
    String(timeoutSeconds),
    "--user-agent",
    "personalweb-link-check/0.1",
    "--output",
    "/dev/null",
    "--write-out",
    "%{http_code}\t%{url_effective}",
  ];

  if (method === "HEAD") {
    args.push("--head");
  }

  args.push(link);

  const { stdout } = await execFileAsync("curl", args, {
    maxBuffer: 1024 * 1024,
  });
  const [statusText, finalUrl] = stdout.trim().split("\t");
  const status = Number(statusText);

  if (!Number.isInteger(status)) {
    fail(`${link} returned an invalid curl status: ${stdout.trim()}`);
  }

  return {
    link,
    status,
    finalUrl: finalUrl || link,
  };
}

async function checkLink(link) {
  let result;

  try {
    result = await curlLink(link, "HEAD");
  } catch {
    result = await curlLink(link, "GET");
  }

  if (result.status === 405 || result.status === 403) {
    result = await curlLink(link, "GET");
  }

  if (result.status < 200 || result.status >= 400) {
    fail(`${link} returned ${result.status}`);
  }

  return result;
}

function formatResultUrl(finalUrl) {
  try {
    const url = new URL(finalUrl);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return finalUrl;
  }
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
    .map(({ status, finalUrl }) => `${status} ${formatResultUrl(finalUrl)}`)
    .join("; ")})`
);
