import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const routesManifestPath = path.join(process.cwd(), ".next", "routes-manifest.json");
const prerenderManifestPath = path.join(process.cwd(), ".next", "prerender-manifest.json");
const appPathsManifestPath = path.join(
  process.cwd(),
  ".next",
  "server",
  "app-paths-manifest.json"
);

function fail(message) {
  console.error(`Route output check failed: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing ${path.relative(process.cwd(), filePath)}; run npm run build first`);
  }

  return JSON.parse(readFileSync(filePath, "utf8"));
}

const routesManifest = readJson(routesManifestPath);
const prerenderManifest = readJson(prerenderManifestPath);
const appPathsManifest = readJson(appPathsManifestPath);

const expectedStaticRoutes = [
  "/",
  "/_not-found",
  "/favicon.ico",
  "/icon",
  "/opengraph-image",
  "/robots.txt",
  "/sitemap.xml",
];
const expectedAppPaths = [
  "/_not-found/page",
  "/favicon.ico/route",
  "/icon/route",
  "/opengraph-image/route",
  "/page",
  "/robots.txt/route",
  "/sitemap.xml/route",
];

if (routesManifest.appType !== "app") {
  fail(`expected app router output, got ${routesManifest.appType ?? "unknown"}`);
}

if ((routesManifest.dynamicRoutes ?? []).length > 0) {
  fail(`expected no dynamic routes, found ${routesManifest.dynamicRoutes.length}`);
}

const staticRoutePages = new Set((routesManifest.staticRoutes ?? []).map((route) => route.page));
for (const route of expectedStaticRoutes) {
  if (!staticRoutePages.has(route)) {
    fail(`missing static route in routes manifest: ${route}`);
  }
}

for (const route of expectedStaticRoutes) {
  if (!prerenderManifest.routes?.[route]) {
    fail(`missing prerendered route: ${route}`);
  }
}

if (prerenderManifest.routes["/_not-found"]?.initialStatus !== 404) {
  fail("not-found route must prerender with 404 status");
}

for (const appPath of expectedAppPaths) {
  if (!appPathsManifest[appPath]) {
    fail(`missing app path manifest entry: ${appPath}`);
  }
}

console.log(
  `Route output check passed (${expectedStaticRoutes.length} static routes, ${expectedAppPaths.length} app paths)`
);
