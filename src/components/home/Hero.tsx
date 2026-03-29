import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import Terminal from "@/components/ui/Terminal";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden bg-[#0B0F19]">
      {/* Background Glows */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-indigo-600/10 blur-[140px] rounded-full opacity-60" />
        <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] -right-[5%] w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10 w-full">
        {/* Left Column */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
          {/* Badge */}
          <div className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-8 transition-all hover:bg-white/[0.08] hover:border-white/20 cursor-pointer">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 group-hover:text-zinc-200 transition-colors">
              1 free credit available
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
          </div>

          {/* Headline - Removed 'opacity-0' and custom 'animate-in' */}
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-white leading-[0.85] mb-8">
            <span className="inline-block transition-transform duration-700">
              Your personal
            </span>
            <br />
            <span className="relative inline-block mt-4">
              <span className="absolute -inset-6 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-600/30 to-blue-500/30 blur-[70px] opacity-50" />
              <span className="relative block">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent blur-md opacity-40">
                  6-agent blog team.
                </span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-500 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
                  6-agent blog team.
                </span>
              </span>
              <span className="absolute -bottom-3 left-0 w-1/2 h-[5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent rounded-full" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed mb-10">
            Deploy an autonomous squad that researches, writes, and fact-checks
            in a single deterministic pipeline. The future of content ops is
            here.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-300 bg-white rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-tighter text-sm">
                write_my_first_blog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </span>
            </Link>

            <Link
              href="#how"
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-zinc-300 transition-all duration-300 bg-white/[0.03] border border-white/10 rounded-2xl hover:text-white backdrop-blur-md"
            >
              How it works
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 pt-10 border-t border-white/5 w-full">
            <div className="flex flex-wrap items-center gap-10 opacity-60">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-zinc-600 uppercase">
                  Architecture
                </span>
                <span className="text-[12px] font-mono text-zinc-300">
                  NEXT.JS 15
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-zinc-600 uppercase">
                  Intelligence
                </span>
                <span className="text-[12px] font-mono text-zinc-300">
                  GPT-5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Terminal */}
        <div className="relative flex items-center justify-center order-1 lg:order-2 h-full min-h-[400px]">
          <div className="relative group w-full max-w-[620px]">
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-blue-500/5 blur-[100px] opacity-50" />
            <div className="relative transition-all duration-700 group-hover:scale-[1.02]">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none" />
              <Terminal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
