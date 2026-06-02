import React from "react";
import { Terminal, Cpu, Globe, ArrowUpRight } from "lucide-react";

/**
 * About Component - Premium SaaS Portfolio Edition
 * Optimized for Tailwind CSS v4
 *
 * Design Spec:
 * - Linear-inspired "Identity Card" for the builder
 * - High-contrast metrics grid
 * - Deep-layered glassmorphism and subtle focal glows
 */

const STATS = [
  {
    label: "Autonomous_Agents",
    value: "6",
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
  { label: "Quality_Threshold", value: "7.0+", icon: <ShieldCheckIcon /> },
  { label: "Onboarding_Credits", value: "1", icon: <ZapIcon /> },
];

const TECH_STACK = [
  "Go",
  "Next.js 15",
  "TypeScript",
  "OpenAI SDK",
  "Tavily",
  "Clerk",
];

const SOCIAL_LINKS = [
  { label: "github", href: "https://github.com/thissidemayur" },
  { label: "x.com", href: "https://x.com/thissidemayur" },
  { label: "linkedin", href: "https://linkedin.com/in/thissidemayur" },
  { label: "portfolio", href: "https://thissidemayur.me" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-32 px-6 border-t border-white/5 bg-[#0B0F19] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32 items-start relative z-10">
        {/* PHILOSOPHY & STORY */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-[1px] w-10 bg-indigo-500/40" />
            <span className="font-mono text-[11px] font-bold text-indigo-400 uppercase tracking-[0.3em]">
              Origin_Story
            </span>
          </div>

          <h3 className="text-4xl md:text-6xl font-black text-white tracking-[-0.04em] leading-[0.95] mb-10">
            Engineered for <br />
            <span className="text-zinc-600 italic">absolute precision.</span>
          </h3>

          <div className="space-y-6 text-zinc-400 text-lg leading-relaxed max-w-xl font-normal group">
            <p className="transition-colors duration-500 hover:text-zinc-300">
              blogoAI emerged as a specialized evolution of my Github Repo- 
              <span className="text-white font-mono text-[15px] mx-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                genai-agentic-systems
              </span>
              repository—a laboratory where I experiment with
              <span className="text-zinc-200 font-medium">
                {" "}
                autonomous agents
              </span>{" "}
              and refined agentic workflows. The mission was clear: move beyond
              brittle chat completions toward a truly deterministic content
              production engine.
            </p>

            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
              {/* Subtle Decorative Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full -mr-12 -mt-12" />

              <p className="relative z-10 italic">
                &quot;By implementing a{" "}
                <span className="text-white font-semibold not-italic tracking-tight underline decoration-indigo-500/50 underline-offset-4">
                  multi-agent consensus model
                </span>
                , we solved for LLM drift.&quot;
              </p>

              <p className="relative z-10 mt-4 text-zinc-500 text-base">
                Every post is scrutinized by a dedicated
                <span className="text-indigo-400 font-mono text-sm mx-1 uppercase tracking-tighter">
                  Critic_Node
                </span>
                . If it fails the 7.0/10 audit, the system triggers a recursive
                self-correction loop.
                <span className="text-white font-medium ml-1">
                  You only see the signal, never the noise.
                </span>
              </p>
            </div>
          </div>

          {/* KPI GRID */}
          <div className="grid grid-cols-3 gap-4 mt-16">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="group p-6 bg-white/[0.02] rounded-[1.5rem] border border-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10"
              >
                <div className="text-zinc-500 mb-4 transition-colors group-hover:text-indigo-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white tracking-tighter mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-[9px] uppercase text-zinc-600 tracking-widest font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUILDER IDENTITY CARD */}
        {/* <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative p-10 md:p-12 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-start justify-between mb-10">
              <div className="flex flex-col">
                <h4 className="text-3xl font-black text-white tracking-tight mb-2">
                  Mayur Pal
                </h4>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">
                    LPU_CSE_&apos;27
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    Jalandhar, IN
                  </span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center font-black text-white text-2xl font-mono">
                  M
                </div>
              </div>
            </div>

            <p className="text-base text-zinc-400 leading-relaxed mb-10 font-normal">
              Full-Stack & DevOps Engineer specializing in high-performance
              agentic systems. My focus is on reducing the entropy of generative
              AI through deterministic pipeline architecture.
            </p>

            <div className="mb-12">
              <p className="font-mono text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">
                Core_Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white hover:border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-all hover:bg-white/[0.05] hover:border-white/10 hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Open_to_opportunities
                </span>
              </div>
              <Globe className="w-4 h-4 text-zinc-800 group-hover:text-zinc-600 transition-colors" />
            </div>
          </div>
        </div>
         */}
      </div>
    </section>
  );
}

// Icons for the KPI Grid
function ShieldCheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.5 14 3l-3 7h9l-10 11.5 3-8.5z" />
    </svg>
  );
}
