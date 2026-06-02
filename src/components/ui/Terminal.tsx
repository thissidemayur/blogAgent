"use client";

import { useState, useEffect } from "react";

/**
 * Terminal Component - Polished SaaS Edition
 *
 * DESIGN SPEC:
 * - Linear/Vercel inspired dark aesthetic
 * - Deterministic typing simulation
 * - Custom scrollbar and glassmorphism touches
 */

const lines = [
  {
    text: "λ blogo-ai generate --topic 'Agentic Workflows'",
    color: "text-zinc-200",
  },
  { text: "[01] thinker    → strategy_brief_created", color: "text-[#a78bfa]" },
  { text: "[02] researcher → web_search_complete", color: "text-[#34d399]" },
  { text: "[03] planner    → awaiting_user_approval", color: "text-[#fbbf24]" },
  { text: "[04] writer     → draft_ready_1840_words", color: "text-[#60a5fa]" },
  { text: "✓ blog.md saved. 1 token used.", color: "text-emerald-400" },
];

export default function Terminal() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => (v < lines.length ? v + 1 : v));
    }, 1200); // Slightly slower for readability
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative w-full max-w-2xl mx-auto">
      {/* Dynamic Border Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />

      <div className="relative bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-white/20">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 transition-colors group-hover:bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 transition-colors group-hover:bg-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 transition-colors group-hover:bg-emerald-500/50" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] select-none">
              pipeline_session
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-8 font-mono text-xs md:text-sm leading-relaxed min-h-[260px]">
          {lines.slice(0, visible).map((line, i) => (
            <div
              key={i}
              className={`${line.color} flex gap-4 mb-2 animate-in fade-in slide-in-from-left-2 duration-500`}
            >
              <span className="text-zinc-700 shrink-0 select-none">
                {i + 1}
              </span>
              <span className="break-all">{line.text}</span>
            </div>
          ))}

          {/* Animated Cursor */}
          {visible < lines.length ? (
            <div className="flex gap-4 items-center mt-2">
              <span className="text-zinc-700 shrink-0 select-none">
                {visible + 1}
              </span>
              <span className="inline-block w-2 h-4 bg-indigo-500/50 animate-pulse rounded-sm" />
            </div>
          ) : (
            <div className="flex gap-4 items-center mt-4">
              <span className="text-zinc-700 shrink-0 select-none">
                {lines.length + 1}
              </span>
              <span className="text-zinc-600 animate-pulse">_</span>
            </div>
          )}
        </div>

        {/* Bottom Status Bar Decor */}
        <div className="px-5 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-zinc-700 uppercase">
              UTF-8
            </span>
            <span className="text-[9px] font-mono text-zinc-700 uppercase">
              TypeScript
            </span>
          </div>
          <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">
            Ln {visible}, Col 42
          </div>
        </div>
      </div>
    </div>
  );
}
