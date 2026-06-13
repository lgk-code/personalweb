import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const knownPostcssAdvisory = {
  id: "GHSA-qx2v-qp2m-jg93",
  patchedVersion: "8.5.10",
  url: "https://github.com/advisories/GHSA-qx2v-qp2m-jg93",
};

function fail(message) {
  console.error(`Audit check failed: ${message}`);
  process.exit(1);
}

const audit = spawnSync("npm", ["audit", "--audit-level=moderate", "--json"], {
  cwd: process.cwd(),
  encoding: "utf8",
});

if (audit.error) {
  fail(audit.error.message);
}

let report;

try {
  report = JSON.parse(audit.stdout);
} catch {
  fail("npm audit did not return valid JSON");
}

const vulnerabilities = report.vulnerabilities ?? {};
const vulnerabilityNames = Object.keys(vulnerabilities);

if (vulnerabilityNames.length === 0) {
  console.log("Audit check passed (no moderate-or-higher advisories)");
  process.exit(0);
}

const unexpectedNames = vulnerabilityNames.filter((name) => name !== "next" && name !== "postcss");

if (unexpectedNames.length > 0) {
  fail(`unexpected advisory package(s): ${unexpectedNames.join(", ")}`);
}

const nextVulnerability = vulnerabilities.next;
const postcssVulnerability = vulnerabilities.postcss;

if (!nextVulnerability || !postcssVulnerability) {
  fail("expected the only known advisory chain to include next and postcss");
}

if (nextVulnerability.severity !== "moderate" || !nextVulnerability.via?.includes("postcss")) {
  fail("next advisory does not match the documented PostCSS dependency chain");
}

const postcssVia = postcssVulnerability.via?.find(
  (entry) => typeof entry === "object" && entry.url === knownPostcssAdvisory.url
);

if (!postcssVia) {
  fail("postcss advisory does not match the documented GHSA");
}

if (
  postcssVulnerability.severity !== "moderate" ||
  postcssVulnerability.range !== `<${knownPostcssAdvisory.patchedVersion}`
) {
  fail("postcss advisory severity or patched range changed; revisit the documented risk");
}

const roadmap = readFileSync(path.join(process.cwd(), "docs", "ROADMAP.md"), "utf8");

for (const marker of [
  knownPostcssAdvisory.id,
  knownPostcssAdvisory.patchedVersion,
  knownPostcssAdvisory.url,
]) {
  if (!roadmap.includes(marker)) {
    fail(`docs/ROADMAP.md must document ${marker}`);
  }
}

console.log(
  `Audit check passed (known ${knownPostcssAdvisory.id} advisory remains documented)`
);
