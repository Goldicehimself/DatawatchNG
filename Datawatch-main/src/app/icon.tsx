import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ffffff",
          borderRadius: "999px",
          display: "flex",
          height: "32px",
          justifyContent: "center",
          width: "32px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#008751",
            borderRadius: "9px",
            color: "#ffffff",
            display: "flex",
            fontSize: "11px",
            fontWeight: 800,
            height: "23px",
            justifyContent: "center",
            letterSpacing: "-1px",
            width: "23px",
          }}
        >
          DW
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
