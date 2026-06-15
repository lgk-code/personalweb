import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/site-url";

const LAST_SIGNIFICANT_UPDATE = new Date("2026-06-15T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl.toString(),
      lastModified: LAST_SIGNIFICANT_UPDATE,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
