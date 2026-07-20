import { ImageResponse } from "next/og";

export const alt = "Rewire — Break bad habits for good, with an AI coach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded Open Graph / social preview image, generated at build time. */
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
          padding: "80px",
          backgroundColor: "#0e1512",
          backgroundImage:
            "radial-gradient(1000px 500px at 15% -10%, rgba(34,197,94,0.28), transparent), radial-gradient(900px 500px at 100% 110%, rgba(16,185,129,0.20), transparent)",
          color: "#f4f7f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            color: "#34d399",
            fontWeight: 600,
          }}
        >
          ✦ GenAI habit &amp; addiction recovery
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#34d399",
            lineHeight: 1,
          }}
        >
          Rewire
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 48,
            fontWeight: 600,
            maxWidth: 900,
            color: "#e2e8e5",
            lineHeight: 1.2,
          }}
        >
          Break bad habits for good, with an AI coach that adapts to you.
        </div>
        <div style={{ marginTop: 48, fontSize: 28, color: "#8ba39a" }}>
          rewire-habit-coach.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
