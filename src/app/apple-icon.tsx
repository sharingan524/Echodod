import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        borderRadius: "32px",
      }}
    >
      {/* Voice waveform bars */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "45px",
            background: "#06b6d4",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            width: "16px",
            height: "75px",
            background: "#06b6d4",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            width: "16px",
            height: "110px",
            background: "#06b6d4",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            width: "16px",
            height: "75px",
            background: "#06b6d4",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            width: "16px",
            height: "45px",
            background: "#06b6d4",
            borderRadius: "8px",
          }}
        />
      </div>
    </div>,
    {
      ...size,
    }
  );
}
