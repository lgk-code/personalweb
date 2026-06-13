import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const assetPaths = [
  "public/projects/aifocus-signal.png",
  "public/projects/hero-workbench.png",
  "src/app/favicon.ico",
];

function readAsset(assetPath) {
  const absolutePath = path.join(process.cwd(), assetPath);
  return existsSync(absolutePath) ? readFileSync(absolutePath) : null;
}

const before = new Map(assetPaths.map((assetPath) => [assetPath, readAsset(assetPath)]));
const result = spawnSync(process.execPath, ["scripts/generate-assets.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const changedAssets = assetPaths.filter((assetPath) => {
  const previous = before.get(assetPath);
  const current = readAsset(assetPath);

  if (previous === null || current === null) {
    return previous !== current;
  }

  return !previous.equals(current);
});

if (changedAssets.length > 0) {
  console.error("Generated assets are out of sync:");
  for (const assetPath of changedAssets) {
    console.error(`- ${assetPath}`);
  }
  console.error("Run npm run assets:generate and include the changed assets.");
  process.exit(1);
}

console.log(`Generated asset check passed (${assetPaths.length} files)`);
