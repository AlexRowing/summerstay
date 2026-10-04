import { ImageResponse } from "next/og";

// Generated favicon: the doorway brand mark (see app/_components/Logo.tsx).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "#82203f",
        borderRadius: 9,
      }}
    >
      <div
        style={{
          width: 11,
          height: 17,
          marginBottom: 6,
          background: "#fdf8f9",
          borderRadius: "6px 6px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 2,
          paddingTop: 4,
        }}
      >
        <div
          style={{
            width: 3,
            height: 3,
            borderRadius: 3,
            background: "#e2792c",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
