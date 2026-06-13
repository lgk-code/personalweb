import { describe, expect, it } from "vitest";
import { portfolio } from "./portfolio";

describe("portfolio content", () => {
  it("uses the public lgk-code identity for the personal site", () => {
    expect(portfolio.identity.handle).toBe("lgk-code");
    expect(portfolio.identity.tagline).toContain("AI");
    expect(portfolio.heroProofPoints.length).toBeGreaterThanOrEqual(3);
  });

  it("features AIFocus and CodePath with accurate, non-sensitive summaries", () => {
    const projectNames = portfolio.projects.map((project) => project.name);

    expect(projectNames).toEqual(expect.arrayContaining(["AIFocus", "CodePath"]));
    expect(portfolio.projects).toHaveLength(2);

    for (const project of portfolio.projects) {
      expect(project.summary).not.toMatch(/\/home\/lgk|API key|token|password/i);
      expect(project.evidence.length).toBeGreaterThanOrEqual(3);
    }

    expect(portfolio.projects.find((project) => project.name === "AIFocus")?.summary).toContain(
      "AI 信息"
    );
    expect(portfolio.projects.find((project) => project.name === "CodePath")?.summary).toContain(
      "GitHub 源码"
    );
  });
});
