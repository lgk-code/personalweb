import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const visualAssets = [
  {
    file: "hero-workbench.png",
    minWidth: 1800,
    minHeight: 1000,
    maxBytes: 450_000,
  },
  {
    file: "aifocus-signal.png",
    minWidth: 1200,
    minHeight: 700,
    maxBytes: 120_000,
  },
  {
    file: "aifocus-signal-mobile.png",
    minWidth: 740,
    minHeight: 900,
    maxBytes: 120_000,
  },
  {
    file: "aifocus-agent-access-crop.png",
    minWidth: 1000,
    minHeight: 520,
    maxBytes: 80_000,
  },
  {
    file: "codepath-browser.png",
    minWidth: 1200,
    minHeight: 1000,
    maxBytes: 400_000,
  },
  {
    file: "codepath-panel-mobile.png",
    minWidth: 880,
    minHeight: 1000,
    maxBytes: 450_000,
  },
  {
    file: "codepath-mcp-comparison.png",
    minWidth: 760,
    minHeight: 400,
    maxWidth: 900,
    maxHeight: 500,
    maxBytes: 90_000,
  },
];

describe("public visual assets", () => {
  it.each(visualAssets)("keeps $file as a useful PNG asset", async (asset) => {
    const filePath = path.join(process.cwd(), "public", "projects", asset.file);
    const metadata = await sharp(filePath).metadata();
    const stats = await sharp(filePath).stats();

    expect(metadata.format).toBe("png");
    expect(metadata.width).toBeGreaterThanOrEqual(asset.minWidth);
    expect(metadata.height).toBeGreaterThanOrEqual(asset.minHeight);

    if (asset.maxWidth !== undefined) {
      expect(metadata.width).toBeLessThanOrEqual(asset.maxWidth);
    }

    if (asset.maxHeight !== undefined) {
      expect(metadata.height).toBeLessThanOrEqual(asset.maxHeight);
    }

    expect(statSync(filePath).size).toBeLessThanOrEqual(asset.maxBytes);
    expect(stats.isOpaque).toBe(true);
  });

  it("keeps favicon as a compact generated ICO", () => {
    const filePath = path.join(process.cwd(), "src", "app", "favicon.ico");
    const icon = readFileSync(filePath);

    expect(icon.readUInt16LE(0)).toBe(0);
    expect(icon.readUInt16LE(2)).toBe(1);
    expect(icon.readUInt16LE(4)).toBe(4);
    expect(statSync(filePath).size).toBeLessThan(10_000);
  });
});
