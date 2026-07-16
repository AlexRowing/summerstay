import { ImageResponse } from "next/og";

// Social share image (link previews on iMessage, Slack, Twitter, etc.).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SummerStay — Summer sublets near campus";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#faf9f7",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 15,
              background: "#e05d3d",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#1c1917" }}>
            SummerStay
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            color: "#1c1917",
            marginTop: 44,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          A summer home near any campus.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#78716c",
            marginTop: 24,
          }}
        >
          Find a sublet, or list your place for the summer.
        </div>
      </div>
    ),
    { ...size },
  );
}
