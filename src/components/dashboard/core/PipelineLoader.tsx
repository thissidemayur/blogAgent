"use client";

// Shown during state.loading = true
// Covers the gap between "user clicked generate" and "first agent_start fires"
// This is the DB credit deduction + pipeline boot time (~5-30s)

const STEPS = [
  "Verifying credits",
  "Booting pipeline",
  "Connecting to agents",
  "Starting Thinker",
];

export function PipelineLoader() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {/* Animated top shimmer */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #6366f1 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.8s linear infinite",
          }}
        />

        <div className="px-5 py-4">
          <div className="flex items-center gap-3 mb-4">
            {/* Spinning ring */}
            <div className="relative w-4 h-4 shrink-0">
              <div
                className="absolute inset-0 rounded-full border border-zinc-700 border-t-indigo-500"
                style={{ animation: "spin 0.9s linear infinite" }}
              />
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Preparing pipeline
              <span style={{ animation: "blink 1.2s step-end infinite" }}>
                ...
              </span>
            </span>
          </div>

          {/* Step indicators */}
          <div className="grid grid-cols-2 gap-2">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/[0.04]"
                style={{
                  opacity: 0,
                  animation: `fade-in-up 0.4s ease forwards`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: "#6366f1",
                    opacity: 0.5,
                    animation: `pulse-dot 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
                <span className="text-[10px] font-mono text-zinc-600">
                  {step}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-zinc-700 mt-3 text-center">
            This takes a few seconds — setting up your 6-agent pipeline
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
