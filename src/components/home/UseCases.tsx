import { PenTool, RefreshCw, ArrowUpRight } from "lucide-react";


const USE_CASES = [
  {
    title: "Write from scratch",
    desc: "Transform a simple topic into a comprehensive, fact-checked blog post. Our agents conduct live research to ensure every claim is cited and current.",
    icon: <PenTool className="w-6 h-6" />,
    tag: "autonomous_generation",
  },
  {
    title: "Improve existing blogs",
    desc: "Bridge the gap between a draft and a masterpiece. Our Editor and Critic agents audit your content for flow, technical depth, and brand alignment.",
    icon: <RefreshCw className="w-6 h-6" />,
    tag: "intelligent_refinement",
  },
];

export default function UseCases() {
  return (
    <section className="py-32 px-6 border-t border-white/5 bg-[#0B0F19] relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-20 max-w-2xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-indigo-500/50" />
            <span className="font-mono text-[11px] text-indigo-400 uppercase tracking-[0.3em]">
              capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
            One platform. <br />
            <span className="text-zinc-500 italic">
              Dual-mode intelligence.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="group relative p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 overflow-hidden"
            >
              {/* Animated Gradient Border (Visible on hover) */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-500 mb-8">
                  {uc.icon}
                </div>

                {/* Title & Description */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {uc.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-base font-normal">
                    {uc.desc}
                  </p>
                </div>

                {/* Technical Metadata */}
                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {uc.tag}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors duration-300" />
                    <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors duration-500" />
                    <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors duration-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
