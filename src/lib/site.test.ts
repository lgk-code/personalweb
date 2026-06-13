import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { site } from "./site";

describe("site metadata", () => {
  it("keeps public identity, repository, and share text in one place", () => {
    expect(site.handle).toBe("lgk-code");
    expect(site.profileUrl).toBe("https://github.com/lgk-code");
    expect(site.repositoryUrl).toBe("https://github.com/lgk-code/personalweb");
    expect(site.title).toContain("AI systems");
    expect(site.description).toContain("AIFocus");
    expect(site.description).toContain("CodePath");
  });

  it("defines compact icon text that is not a scaffold default", () => {
    expect(site.iconText).toBe("lgk");
    expect(site.iconText).not.toMatch(/next|vercel/i);
  });

  it("keeps generated visual assets available for the first screen", () => {
    const heroAsset = path.join(process.cwd(), "public", "projects", "hero-workbench.png");

    expect(existsSync(heroAsset)).toBe(true);
    expect(statSync(heroAsset).size).toBeGreaterThan(50_000);
  });
});
