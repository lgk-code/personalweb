import { afterEach, beforeEach, describe, expect, it } from "vitest";
import manifest from "./manifest";
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

  it("generates a compact web app manifest from site metadata", () => {
    expect(manifest()).toEqual({
      name: "lgk-code",
      short_name: "lgk-code",
      description: "lgk-code 的个人网站，展示 AIFocus、CodePath 和 AI 产品工程实践。",
      start_url: "/",
      display: "standalone",
      background_color: "#f4f6f1",
      theme_color: "#151713",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
        {
          src: "/icon",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "/apple-icon",
          sizes: "180x180",
          type: "image/png",
          purpose: "any",
        },
      ],
    });
  });
});
