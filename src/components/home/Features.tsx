import React from "react";
import {
  Globe,
  MessageSquare,
  ShieldCheck,
  Cpu,
  Zap,
  Activity,
} from "lucide-react";

/**
 * Features Component - High-End SaaS Edition
 *
 * Design Spec:
 * - Linear-inspired "Spotlight" borders
 * - Multi-layer background depth
 * - Sophisticated typography scale
 */

const FEATURES = [
  {
    title: "Live Web Search",
    desc: "Our agents deploy specialized web-crawlers via Tavily to harvest real-time data, ensuring your content is never limited by training data cutoff dates.",
    icon: <Globe className="w-6 h-6" />,
    label: "real_time_research",
    color: "group-hover:text-emerald-400",
    glow: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/30",
  },
  {
    title: "Human-in-the-Loop",
    desc: "Total control without the manual labor. The pipeline pauses for your strategic approval after the outline phase to ensure the perfect direction.",
    icon: <MessageSquare className="w-6 h-6" />,
    label: "validation_gate",
    color: "group-hover:text-indigo-400",
    glow: "bg-indigo-500/10",
    border: "group-hover:border-indigo-500/30",
  },
  {
    title: "Autonomous Audit",
    desc: "Every draft is subjected to a proprietary 7.0/10 quality gate. If the score misses the mark, the Critic agent triggers a self-correction loop.",
    icon: <ShieldCheck className="w-6 h-6" />,
    label: "critic_node_audit",
    color: "group-hover:text-orange-400",
    glow: "bg-orange-500/10",
    border: "group-hover:border-orange-500/30",
  },
];

export default function Features() {
  return (
    <section className="relative py-32 px-6 border-t border-white/5 bg-[#0B0F19] overflow-hidden">
      {/* Background Depth Layers */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full border border-[#0B0F19] bg-emerald-500/20 flex items-center justify-center">
                  <Activity className="w-2.5 h-2.5 text-emerald-500" />
                </div>
                <div className="w-5 h-5 rounded-full border border-[#0B0F19] bg-indigo-500/20 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-indigo-500" />
                </div>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.3em]">
                core_infrastructure
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95]">
              Engineered for <br />
              <span className="text-zinc-600">production-grade output.</span>
            </h2>
          </div>
          <div className="md:mb-2">
            <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed border-l border-white/10 pl-6">
              Deterministic content generation that scales beyond simple LLM
              completions.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-2 overflow-hidden"
            >
              {/* Subtle Spotlight Glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${f.glow}`}
              />

              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center transition-all duration-500 mb-8 text-zinc-500 ${f.color} ${f.border}`}
                >
                  {f.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-sans mb-10 group-hover:text-zinc-400 transition-colors">
                  {f.desc}
                </p>

                {/* Technical Tag */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-700 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:text-zinc-400 group-hover:border-white/10 transition-all">
                    {f.label}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Console-style Footer Decor */}
        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-zinc-500" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                Node_Architecture: V4
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-zinc-500" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                Latency: Optimised
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
            ))}
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white ml-2">
              autonomous_ops_active
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
