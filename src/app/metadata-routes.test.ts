import { afterEach, beforeEach, describe, expect, it } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

const SITE_URL_KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"];
const originalValues = new Map(SITE_URL_KEYS.map((key) => [key, process.env[key]]));

function clearSiteUrlEnv() {
  for (const key of SITE_URL_KEYS) {
    delete process.env[key];
  }
}

describe("metadata routes", () => {
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

  it("generates robots.txt data for the resolved site URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://lgk-code.dev";

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://lgk-code.dev/sitemap.xml",
      host: "lgk-code.dev",
    });
  });

  it("generates the homepage sitemap entry", () => {
    const [home] = sitemap();

    expect(home.url).toBe("http://localhost:3000/");
    expect(home.changeFrequency).toBe("monthly");
    expect(home.priority).toBe(1);
  });
});
