// app/opengraph-image.tsx
// Next.js generates /opengraph-image.png from this file automatically
// No external image needed — generated at build time

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "blogoAIagento — 6-Agent AI Blog Generator by Mayur Pal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#09090b",
        padding: "60px 72px",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      {/* Grid background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "6px",
          height: "100%",
          background: "linear-gradient(180deg, #6366f1, #a78bfa)",
        }}
      />

      {/* Top section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "999px",
            padding: "6px 16px",
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          />
          <span
            style={{
              color: "#a78bfa",
              fontSize: "13px",
              letterSpacing: "0.1em",
            }}
          >
            AI-POWERED · MULTI-AGENT PIPELINE
          </span>
        </div>

        {/* Product name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "#f4f4f5",
            lineHeight: "1",
            letterSpacing: "-2px",
          }}
        >
          blogoAIagento
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#71717a",
            maxWidth: "700px",
            lineHeight: "1.4",
          }}
        >
          Enter a topic. Six AI agents think, research, plan, write, edit &
          review your blog post automatically.
        </div>
      </div>

      {/* Agent pipeline row */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {[
          { label: "Thinker", color: "#a78bfa" },
          { label: "Researcher", color: "#34d399" },
          { label: "Planner", color: "#fbbf24" },
          { label: "Writer", color: "#60a5fa" },
          { label: "Editor", color: "#f472b6" },
          { label: "Critic", color: "#fb923c" },
        ].map((a, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                backgroundColor: a.color + "20",
                border: `1px solid ${a.color}40`,
                borderRadius: "8px",
                padding: "8px 14px",
                color: a.color,
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {a.label}
            </div>
            {i < 5 && (
              <span style={{ color: "#3f3f46", fontSize: "16px" }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "24px",
        }}
      >
        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600" }}
            >
              Mayur Pal
            </span>
            <span style={{ color: "#52525b", fontSize: "12px" }}>
              thissidemayur.me · LPU CSE &apos;26
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[
            { val: "6", label: "Agents" },
            { val: "7.0+", label: "Min Score" },
            { val: "Free", label: "1st Blog" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#6366f1",
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                {s.val}
              </span>
              <span style={{ color: "#52525b", fontSize: "11px" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
