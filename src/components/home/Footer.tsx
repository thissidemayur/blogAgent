import React from "react";
import Link from "next/link";
import { Cpu, ArrowUpRight, Globe,  } from "lucide-react";

/**
 * Footer Component - Premium SaaS Edition
 * Optimized for Tailwind CSS v4
 *
 * FIX: Replaced non-existent Lucide social icons with high-fidelity
 * SVG paths or generic Lucide alternatives (Globe/Github).
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 px-6 border-t border-white/5 bg-[#0B0F19] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* BRANDING COLUMN */}
          <div className="flex flex-col items-center md:items-start lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono group mb-6"
            >
              <span className="text-zinc-700 font-bold transition-colors group-hover:text-indigo-500">
                [
              </span>
              <span className="text-white font-black text-sm tracking-tighter uppercase italic">
                blogoAIagento
              </span>
              <span className="text-zinc-700 font-bold transition-colors group-hover:text-indigo-500">
                ]
              </span>
            </Link>
            <p className="max-w-xs text-center md:text-left text-zinc-500 text-xs leading-relaxed font-sans mb-8">
              The first deterministic content pipeline engineered to eliminate
              LLM drift through autonomous multi-agent consensus.
            </p>

            {/* SOCIAL BAR (Using SVGs for X and LinkedIn for Professional Look) */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/thissidemayur"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.06] transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>{" "}
              </a>
              <a
                href="https://x.com/thissidemayur"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.06] transition-all"
              >
                {/* Custom X Logo Path */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/thissidemayur"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.06] transition-all"
              >
                {/* Custom LinkedIn Logo Path */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://thissidemayur.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.06] transition-all"
              >
                <Globe size={14} />
              </a>
            </div>
          </div>

          {/* NAVIGATION COLUMN */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-6">
              Protocol_Index
            </h4>
            <div className="flex flex-col items-center md:items-start gap-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              <Link
                href="#home"
                className="hover:text-white transition-colors flex items-center gap-1 group"
              >
                home{" "}
                <ArrowUpRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
              <Link
                href="#how"
                className="hover:text-white transition-colors flex items-center gap-1 group"
              >
                the_process{" "}
                <ArrowUpRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
              <Link
                href="#pricing"
                className="hover:text-white transition-colors flex items-center gap-1 group"
              >
                pricing{" "}
                <ArrowUpRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
              <Link
                href="#about"
                className="hover:text-white transition-colors flex items-center gap-1 group"
              >
                about_builder{" "}
                <ArrowUpRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>

          {/* SYSTEM STATUS COLUMN */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-6">
              Node_Status
            </h4>
            <div className="space-y-4 w-full max-w-[200px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-600 uppercase">
                  Engine
                </span>
                <span className="font-mono text-[9px] text-emerald-500 uppercase font-bold tracking-tighter">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-600 uppercase">
                  Agents
                </span>
                <span className="font-mono text-[9px] text-emerald-500 uppercase font-bold tracking-tighter">
                  Connected
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                <Cpu size={12} className="text-indigo-400" />
                <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest">
                  v4.0.2_Stable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-[9px] font-mono text-zinc-700 tracking-[0.3em] uppercase">
              © {currentYear}_blogoai_protocol
            </span>
            <div className="hidden md:block h-3 w-px bg-white/5" />
            <Link
              href="https://thissidemayur.me"
              target="_blank"
              className="text-[9px] font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.1em]"
            >
              engineered_by_thissidemayur
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full font-mono text-[8px] text-zinc-600 uppercase tracking-[0.2em]">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              system_online
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-zinc-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
