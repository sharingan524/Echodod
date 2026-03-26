import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
      }}
    >
      {/* Voice waveform bars */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
        }}
      >
        <div
          style={{
            width: "3px",
            height: "8px",
            background: "#2563eb",
            borderRadius: "1.5px",
          }}
        />
        <div
          style={{
            width: "3px",
            height: "14px",
            background: "#2563eb",
            borderRadius: "1.5px",
          }}
        />
        <div
          style={{
            width: "3px",
            height: "20px",
            background: "#2563eb",
            borderRadius: "1.5px",
          }}
        />
        <div
          style={{
            width: "3px",
            height: "14px",
            background: "#2563eb",
            borderRadius: "1.5px",
          }}
        />
        <div
          style={{
            width: "3px",
            height: "8px",
            background: "#2563eb",
            borderRadius: "1.5px",
          }}
        />
      </div>
    </div>,
    {
      ...size,
    }
  );
}
