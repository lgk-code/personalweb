import { ImageResponse } from "next/og";
import { site } from "../lib/site";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#151713",
          border: "12px solid #f7f3ea",
          color: "#f7f3ea",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 62,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: 0,
          width: "100%",
        }}
      >
        {site.iconText}
      </div>
    ),
    {
      ...size,
    }
  );
}
