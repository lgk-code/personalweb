import { describe, expect, it } from "vitest";
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
];

describe("public visual assets", () => {
  it.each(visualAssets)("keeps $file as a useful PNG asset", async (asset) => {
    const filePath = path.join(process.cwd(), "public", "projects", asset.file);
    const metadata = await sharp(filePath).metadata();
    const stats = await sharp(filePath).stats();

    expect(metadata.format).toBe("png");
    expect(metadata.width).toBeGreaterThanOrEqual(asset.minWidth);
    expect(metadata.height).toBeGreaterThanOrEqual(asset.minHeight);
    expect(stats.isOpaque).toBe(true);
  });
});
