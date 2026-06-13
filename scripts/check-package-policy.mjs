import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJsonPath = path.join(root, "package.json");
const npmrcPath = path.join(root, ".npmrc");

function fail(message) {
  console.error(`Package policy check failed: ${message}`);
  process.exit(1);
}

function readRequiredFile(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing ${path.relative(root, filePath)}`);
  }

  return readFileSync(filePath, "utf8");
}

const packageJson = JSON.parse(readRequiredFile(packageJsonPath));
const npmrc = readRequiredFile(npmrcPath);

if (!/^save-exact\s*=\s*true$/m.test(npmrc)) {
  fail(".npmrc must set save-exact=true");
}

if (packageJson.engines?.node !== ">=20.19.0") {
  fail('package.json must keep engines.node at ">=20.19.0"');
}

const runtimeDependencies = packageJson.dependencies ?? {};
const nonExactRuntimeDependencies = Object.entries(runtimeDependencies).filter(([, version]) =>
  /^[~^*]|latest|workspace:|file:|link:/i.test(String(version))
);

if (nonExactRuntimeDependencies.length > 0) {
  fail(
    `runtime dependencies must be exact-pinned: ${nonExactRuntimeDependencies
      .map(([name, version]) => `${name}@${version}`)
      .join(", ")}`
  );
}

if (runtimeDependencies.react !== runtimeDependencies["react-dom"]) {
  fail("react and react-dom must stay on the same version");
}

if (packageJson.overrides?.next?.postcss !== "8.5.10") {
  fail('next.postcss override must stay at "8.5.10" until the upstream advisory is resolved');
}

console.log(
  `Package policy check passed (${Object.keys(runtimeDependencies).length} runtime dependencies)`
);
