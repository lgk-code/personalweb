import { describe, expect, it } from "vitest";
import { contentType as appleIconContentType, size as appleIconSize } from "./apple-icon";
import { contentType as iconContentType, size as iconSize } from "./icon";
import {
  alt as openGraphAlt,
  contentType as openGraphContentType,
  size as openGraphSize,
} from "./opengraph-image";

describe("image metadata routes", () => {
  it("keeps the icon route as a compact PNG", () => {
    expect(iconContentType).toBe("image/png");
    expect(iconSize).toEqual({
      width: 64,
      height: 64,
    });
  });

  it("keeps the apple icon route in a home-screen friendly size", () => {
    expect(appleIconContentType).toBe("image/png");
    expect(appleIconSize).toEqual({
      width: 180,
      height: 180,
    });
  });

  it("keeps the Open Graph image route in a share-friendly shape", () => {
    expect(openGraphContentType).toBe("image/png");
    expect(openGraphSize).toEqual({
      width: 1200,
      height: 630,
    });
    expect(openGraphAlt).toContain("lgk-code");
  });
});
