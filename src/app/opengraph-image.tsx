import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = "lgk-code personal website preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#eee5d5",
          color: "#181713",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: 54,
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "3px solid #181713",
            borderRadius: 12,
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            padding: 46,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 690 }}>
            <div
              style={{
                color: "#b3261e",
                fontFamily: "Courier New, monospace",
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 28,
              }}
            >
              AI systems / product craft
            </div>
            <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 0.9 }}>{site.handle}</div>
            <div style={{ color: "#5f5b52", fontSize: 34, lineHeight: 1.25, marginTop: 34 }}>
              {site.shareDescription}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              width: 260,
            }}
          >
            {site.shareHighlights.map((item, index) => (
              <div
                key={item}
                style={{
                  background: index === 0 ? "#286a4b" : index === 1 ? "#285f8f" : "#151713",
                  borderRadius: 8,
                  color: "#fffdf8",
                  display: "flex",
                  fontFamily: "Courier New, monospace",
                  fontSize: 26,
                  justifyContent: "center",
                  padding: "24px 18px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
