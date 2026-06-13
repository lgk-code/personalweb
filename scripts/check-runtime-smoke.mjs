import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const host = "127.0.0.1";
const startupTimeoutMs = 30_000;

function fail(message) {
  throw new Error(`Runtime smoke check failed: ${message}`);
}

function getOpenPort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();

    server.once("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : undefined;
      server.close(() => {
        if (!port) {
          reject(new Error("could not allocate an open port"));
          return;
        }

        resolve(port);
      });
    });
  });
}

function startServer(port) {
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [nextBin, "start", "--hostname", host, "--port", String(port)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      NEXT_PUBLIC_SITE_URL: `http://${host}:${port}`,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  return { child, getOutput: () => output };
}

function stopServer(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      child.stdout.destroy();
      child.stderr.destroy();
      resolve();
    }, 5_000);

    child.once("exit", () => {
      clearTimeout(timeout);
      child.stdout.destroy();
      child.stderr.destroy();
      resolve();
    });
    child.kill("SIGTERM");
  });
}

async function waitForReady(baseUrl, child, getOutput) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < startupTimeoutMs) {
    if (child.exitCode !== null) {
      fail(`server exited early with code ${child.exitCode}\n${getOutput()}`);
    }

    try {
      const response = await fetch(baseUrl, { cache: "no-store" });
      if (response.status === 200) {
        await response.arrayBuffer();
        return;
      }
    } catch {
      // The production server may still be starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  fail(`server did not become ready within ${startupTimeoutMs}ms\n${getOutput()}`);
}

function assertHeader(headers, name, expectedValue) {
  const actualValue = headers.get(name);

  if (actualValue !== expectedValue) {
    fail(`expected ${name}: ${expectedValue}, got ${actualValue ?? "missing"}`);
  }
}

async function assertTextRoute(baseUrl, route, expectedStatus, expectedText, expectedContentType) {
  const response = await fetch(new URL(route, baseUrl), { cache: "no-store" });
  const body = await response.text();

  if (response.status !== expectedStatus) {
    fail(`${route} returned ${response.status}, expected ${expectedStatus}`);
  }

  if (!response.headers.get("content-type")?.includes(expectedContentType)) {
    fail(`${route} content-type mismatch: ${response.headers.get("content-type") ?? "missing"}`);
  }

  for (const text of expectedText) {
    if (!body.includes(text)) {
      fail(`${route} missing expected text: ${text}`);
    }
  }

  return response;
}

async function assertBinaryRoute(baseUrl, route, expectedContentType, minBytes) {
  const response = await fetch(new URL(route, baseUrl), { cache: "no-store" });
  const bytes = await response.arrayBuffer();

  if (response.status !== 200) {
    fail(`${route} returned ${response.status}, expected 200`);
  }

  if (!response.headers.get("content-type")?.includes(expectedContentType)) {
    fail(`${route} content-type mismatch: ${response.headers.get("content-type") ?? "missing"}`);
  }

  if (bytes.byteLength < minBytes) {
    fail(`${route} response is unexpectedly small (${bytes.byteLength} bytes, expected >= ${minBytes})`);
  }
}

let child;

try {
  const port = await getOpenPort();
  const baseUrl = `http://${host}:${port}`;
  const server = startServer(port);
  child = server.child;
  const { getOutput } = server;

  await waitForReady(baseUrl, child, getOutput);

  const home = await assertTextRoute(
    baseUrl,
    "/",
    200,
    ["lgk-code", "AIFocus", "CodePath", "现场记录"],
    "text/html"
  );
  assertHeader(home.headers, "x-content-type-options", "nosniff");
  assertHeader(home.headers, "referrer-policy", "strict-origin-when-cross-origin");
  assertHeader(home.headers, "x-frame-options", "DENY");
  assertHeader(home.headers, "permissions-policy", "camera=(), microphone=(), geolocation=()");

  if (home.headers.has("x-powered-by")) {
    fail("homepage must not include X-Powered-By");
  }

  await assertTextRoute(
    baseUrl,
    "/robots.txt",
    200,
    ["User-Agent: *", "Allow: /", "Sitemap:", "/sitemap.xml"],
    "text/plain"
  );
  await assertTextRoute(baseUrl, "/sitemap.xml", 200, ["<urlset", "<loc>", "</loc>"], "application/xml");
  await assertTextRoute(baseUrl, "/missing-runtime-smoke", 404, ["这条路径还没被构建出来。"], "text/html");
  await assertBinaryRoute(baseUrl, "/icon", "image/png", 500);
  await assertBinaryRoute(baseUrl, "/opengraph-image", "image/png", 10_000);

  console.log("Runtime smoke check passed (homepage, 404, metadata routes, image routes, headers)");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  if (child) {
    await stopServer(child);
  }
}
