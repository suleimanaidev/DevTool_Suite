import { ImageResponse } from "next/og";

// The preview picture shown when the site is shared (Facebook, WhatsApp, LinkedIn, X...).
export const alt = "DevTools Suite - free online tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#FFF3E0",
          color: "#2b1a1d",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#D72638" }}>DevTools Suite</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
          Free online tools for everyday work
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 36, color: "#7a6468", lineHeight: 1.5 }}>
          Typing Test · Markdown Editor · Invoice Maker · Stopwatch
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#7a6468", lineHeight: 1.5 }}>
          Word Counter · Countdown Timer · Calculator
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#7a6468", lineHeight: 1.5 }}>
          Image Metadata · Color Palette · CSV to JSON · QR Code
        </div>
        <div style={{ display: "flex", width: 160, height: 10, background: "#D72638", marginTop: 48 }} />
      </div>
    ),
    size
  );
}
