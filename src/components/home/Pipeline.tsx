import React from "react";
import {
  BrainCircuit,
  Search,
  ListTree,
  PenTool,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

/**
 * Pipeline Component - High-End SaaS Edition
 * Design Spec:
 * - Linear-inspired "Connecting Nodes" aesthetic
 * - Animated flow indicators between agents
 * - Glassmorphism and subtle elevation
 */

const STEPS = [
  {
    id: "01",
    name: "Thinker",
    task: "Goal & Tone",
    icon: <BrainCircuit className="w-5 h-5" />,
    color: "from-violet-500/20 to-transparent",
    border: "group-hover:border-violet-500/50",
    text: "text-violet-400",
  },
  {
    id: "02",
    name: "Researcher",
    task: "Live Internet",
    icon: <Search className="w-5 h-5" />,
    color: "from-emerald-500/20 to-transparent",
    border: "group-hover:border-emerald-500/50",
    text: "text-emerald-400",
  },
  {
    id: "03",
    name: "Planner",
    task: "Outline",
    icon: <ListTree className="w-5 h-5" />,
    color: "from-amber-500/20 to-transparent",
    border: "group-hover:border-amber-500/50",
    text: "text-amber-400",
  },
  {
    id: "04",
    name: "Writer",
    task: "Full Draft",
    icon: <PenTool className="w-5 h-5" />,
    color: "from-blue-500/20 to-transparent",
    border: "group-hover:border-blue-500/50",
    text: "text-blue-400",
  },
  {
    id: "05",
    name: "Editor",
    task: "Polish",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-pink-500/20 to-transparent",
    border: "group-hover:border-pink-500/50",
    text: "text-pink-400",
  },
  {
    id: "06",
    name: "Critic",
    task: "Quality Gate",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "from-orange-500/20 to-transparent",
    border: "group-hover:border-orange-500/50",
    text: "text-orange-400",
  },
];

export default function Pipeline() {
  return (
    <section
      id="how"
      className="py-32 px-6 border-t border-white/5 bg-[#0B0F19] relative"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.3em]">
                System Workflow
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95]">
              Six specialized nodes. <br />
              <span className="text-zinc-600">One unified output.</span>
            </h2>
          </div>
          <p className="text-zinc-500 font-sans max-w-xs text-sm md:text-base mb-2">
            Every generation follows a deterministic chain of command to
            eliminate AI drift and hallucination.
          </p>
        </div>

        {/* Pipeline Container */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="group relative">
              {/* Desktop Connecting Arrow/Line */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-400 transition-colors duration-500" />
                </div>
              )}

              {/* Step Card */}
              <div
                className={`
                relative h-full p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 
                transition-all duration-500 overflow-hidden
                hover:bg-white/[0.04] hover:-translate-y-2 ${step.border}
              `}
              >
                {/* Internal Glow on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10 flex flex-col h-full items-center text-center">
                  {/* Icon Node */}
                  <div
                    className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                    bg-[#111827] border border-white/5 shadow-2xl transition-all duration-500
                    group-hover:border-white/20 group-hover:scale-110 ${step.text}
                  `}
                  >
                    {step.icon}
                  </div>

                  {/* ID & Name */}
                  <span
                    className={`font-mono text-[10px] font-bold mb-2 tracking-widest ${step.text}`}
                  >
                    STEP_{step.id}
                  </span>
                  <h4 className="text-white font-bold text-lg mb-2 tracking-tight">
                    {step.name}
                  </h4>

                  {/* Task Description */}
                  <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                    {step.task}
                  </p>

                  {/* Status Indicator */}
                  <div className="mt-8 flex gap-1">
                    <div className="w-1.5 h-0.5 rounded-full bg-zinc-800 group-hover:bg-white/40 transition-all duration-300" />
                    <div className="w-1.5 h-0.5 rounded-full bg-zinc-800 group-hover:bg-white/40 transition-all duration-500" />
                    <div className="w-1.5 h-0.5 rounded-full bg-zinc-800 group-hover:bg-white/40 transition-all duration-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Console Execution Footer */}
        <div className="mt-20 flex flex-col items-center">
          <div className="p-[1px] rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent w-full mb-12" />

        
        </div>
      </div>
    </section>
  );
}
