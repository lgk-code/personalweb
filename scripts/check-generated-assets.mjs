import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const assetPaths = [
  "public/projects/aifocus-signal.png",
  "public/projects/aifocus-signal-mobile.png",
  "public/projects/codepath-panel-mobile.png",
  "public/projects/hero-workbench.png",
  "src/app/favicon.ico",
];

function readAsset(assetPath) {
  const absolutePath = path.join(process.cwd(), assetPath);
  return existsSync(absolutePath) ? readFileSync(absolutePath) : null;
}

const tempRoot = mkdtempSync(path.join(os.tmpdir(), "personalweb-assets-"));
let exitCode = 0;

try {
  const result = spawnSync(process.execPath, ["scripts/generate-assets.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ASSET_OUTPUT_ROOT: tempRoot,
    },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    exitCode = result.status ?? 1;
  } else {
    const changedAssets = assetPaths.filter((assetPath) => {
      const current = readAsset(assetPath);
      const generatedPath = path.join(tempRoot, assetPath);
      const generated = existsSync(generatedPath) ? readFileSync(generatedPath) : null;

      if (current === null || generated === null) {
        return current !== generated;
      }

      return !current.equals(generated);
    });

    if (changedAssets.length > 0) {
      console.error("Generated assets are out of sync:");
      for (const assetPath of changedAssets) {
        console.error(`- ${assetPath}`);
      }
      console.error("Run npm run assets:generate and include the changed assets.");
      exitCode = 1;
    } else {
      console.log(`Generated asset check passed (${assetPaths.length} files)`);
    }
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

if (exitCode !== 0) {
  process.exit(exitCode);
}
