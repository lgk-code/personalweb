import { spawnSync } from "node:child_process";

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

const vulnerabilities = report.metadata?.vulnerabilities ?? {};
const total =
  (vulnerabilities.moderate ?? 0) +
  (vulnerabilities.high ?? 0) +
  (vulnerabilities.critical ?? 0);

if (total > 0) {
  const names = Object.keys(report.vulnerabilities ?? {}).join(", ");
  fail(`found ${total} moderate-or-higher advisory item(s): ${names}`);
}

console.log("Audit check passed (no moderate-or-higher advisories)");
