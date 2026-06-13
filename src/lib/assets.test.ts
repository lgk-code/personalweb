import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const visualAssets = [
  {
    file: "hero-workbench.png",
    minWidth: 1800,
    minHeight: 1000,
  },
  {
    file: "aifocus-signal.png",
    minWidth: 1200,
    minHeight: 700,
  },
  {
    file: "codepath-browser.png",
    minWidth: 1200,
    minHeight: 1000,
  },
  {
    file: "codepath-mcp-comparison.png",
    minWidth: 760,
    minHeight: 400,
    maxWidth: 900,
    maxHeight: 500,
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
