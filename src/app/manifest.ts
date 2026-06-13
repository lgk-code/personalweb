import type { MetadataRoute } from "next";
import { site } from "../lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.handle,
    short_name: site.handle,
    description: site.description,
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
  };
}
