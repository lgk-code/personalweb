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
    expect(portfolio.projects.find((project) => project.name === "AIFocus")?.links).toEqual([]);
    expect(portfolio.projects.find((project) => project.name === "CodePath")?.links[0]?.href).toBe(
      "https://github.com/lgk-code/codepath-extension/releases/latest"
    );
  });

  it("documents project-backed evidence chains without private paths", () => {
    expect(portfolio.evidenceChains).toHaveLength(3);
    expect(portfolio.evidenceChains.map((chain) => chain.label)).toEqual([
      "AIFocus",
      "CodePath",
      "personalweb",
    ]);
    expect(portfolio.evidenceChains[0].body).toContain("RSS");
    expect(portfolio.evidenceChains[0].body).toContain("Skill");
    expect(portfolio.evidenceChains[1].body).toContain("MCP");

    for (const chain of portfolio.evidenceChains) {
      expect(chain.body).not.toMatch(/\/home\/lgk|API key|token|password/i);
    }
  });
});
