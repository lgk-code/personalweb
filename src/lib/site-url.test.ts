import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "./site-url";

const SITE_URL_KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL", "PORT"];
const originalValues = new Map(SITE_URL_KEYS.map((key) => [key, process.env[key]]));

function clearSiteUrlEnv() {
  for (const key of SITE_URL_KEYS) {
    delete process.env[key];
  }
}

describe("getSiteUrl", () => {
  beforeEach(() => {
    clearSiteUrlEnv();
  });

  afterEach(() => {
    clearSiteUrlEnv();

    for (const [key, value] of originalValues) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it("uses NEXT_PUBLIC_SITE_URL first and adds https when needed", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "lgk-code.dev";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "production.example.com";

    expect(getSiteUrl().toString()).toBe("https://lgk-code.dev/");
  });

  it("normalizes deploy URLs to the site origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://lgk-code.dev/some/path?preview=1#section";

    expect(getSiteUrl().toString()).toBe("https://lgk-code.dev/");
  });

  it("falls back through Vercel URLs before local development", () => {
    process.env.VERCEL_URL = "preview.example.com";

    expect(getSiteUrl().toString()).toBe("https://preview.example.com/");

    process.env.VERCEL_PROJECT_PRODUCTION_URL = "production.example.com";

    expect(getSiteUrl().toString()).toBe("https://production.example.com/");
  });

  it("uses localhost when no deploy URL is available", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "://broken";

    expect(getSiteUrl().toString()).toBe("http://localhost:3000/");
  });

  it("uses the local PORT when no deploy URL is available", () => {
    process.env.PORT = "3001";

    expect(getSiteUrl().toString()).toBe("http://localhost:3001/");
  });

  it("ignores invalid local PORT values", () => {
    process.env.PORT = "not-a-port";

    expect(getSiteUrl().toString()).toBe("http://localhost:3000/");
  });
});
