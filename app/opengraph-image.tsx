import { ImageResponse } from "next/og";

// Social share image (link previews on iMessage, GroupMe, Instagram, etc.).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SummerStay: student subleases in Blacksburg";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#82203f",
        padding: "72px 80px",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Oversized doorway, echoing the logo */}
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 120,
          width: 340,
          height: 560,
          borderRadius: "170px 170px 0 0",
          background: "rgba(255,255,255,0.1)",
          display: "flex",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#fdf8f9",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 30,
              marginBottom: 10,
              background: "#82203f",
              borderRadius: "10px 10px 0 0",
              display: "flex",
            }}
          />
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#fdf8f9" }}>
          SummerStay
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#fdf8f9",
            letterSpacing: -2.5,
            lineHeight: 1.04,
            maxWidth: 780,
          }}
        >
          Blacksburg subleases, without the group chat chaos.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(253,248,249,0.78)",
            marginTop: 26,
          }}
        >
          Summer, semester, or winter break. Posted by students.
        </div>
      </div>
    </div>,
    { ...size },
  );
}
