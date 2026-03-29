"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal as TerminalIcon,
  Check,
  ArrowRight,
  Search,
  Layout,
  PenTool,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  Globe,
  Zap,
} from "lucide-react";

// --- DATA ---

const USE_CASES = [
  {
    title: "Write from scratch",
    desc: "Enter a topic. Our agents search the live internet, find facts, and write a full, cited blog post for you.",
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    title: "Improve existing blogs",
    desc: "Paste your draft. Our Editor and Critic agents will rewrite it for better flow, tone, and accuracy.",
    icon: <RefreshCw className="w-5 h-5" />,
  },
];

const STEPS = [
  {
    id: "01",
    name: "Thinker",
    task: "Sets the goal & tone",
    color: "text-[#a78bfa]",
  },
  {
    id: "02",
    name: "Researcher",
    task: "Searches live internet",
    color: "text-[#34d399]",
  },
  {
    id: "03",
    name: "Planner",
    task: "Drafts the outline",
    color: "text-[#fbbf24]",
  },
  {
    id: "04",
    name: "Writer",
    task: "Writes the full draft",
    color: "text-[#60a5fa]",
  },
  {
    id: "05",
    name: "Editor",
    task: "Polishes every word",
    color: "text-[#f472b6]",
  },
  {
    id: "06",
    name: "Critic",
    task: "Final quality check",
    color: "text-[#fb923c]",
  },
];

// --- COMPONENTS ---

function Terminal() {
  const [visible, setVisible] = useState(0);
  const lines = [
    {
      text: "λ start_generation --topic 'Hybrid Cloud'",
      color: "text-zinc-200",
    },
    {
      text: "[Agent] Researcher is searching Google...",
      color: "text-[#34d399]",
    },
    { text: "[Agent] Planner created 8 sections.", color: "text-[#fbbf24]" },
    {
      text: "[Agent] Editor is polishing the hook...",
      color: "text-[#f472b6]",
    },
    { text: "✓ Done. 1,200 words ready.", color: "text-emerald-400" },
  ];

  useEffect(() => {
    const int = setInterval(
      () => setVisible((v) => (v < lines.length ? v + 1 : v)),
      1200,
    );
    return () => clearInterval(int);
  }, []);

  return (
    <div className="bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden font-mono text-sm shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
          Active Pipeline
        </span>
      </div>
      <div className="p-6 space-y-3 min-h-[220px]">
        {lines.slice(0, visible).map((l, i) => (
          <div key={i} className={l.color}>
            <span className="mr-3 opacity-30">#</span>
            {l.text}
          </div>
        ))}
        {visible < lines.length && (
          <span className="inline-block w-2 h-4 bg-zinc-500 animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 selection:bg-indigo-500/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-white font-bold tracking-tighter"
          >
            blogoAIagento
          </Link>
          <div className="hidden md:flex gap-8 items-center text-[10px] font-mono uppercase tracking-widest">
            <a href="#how" className="hover:text-white">
              How
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-black px-4 py-2 rounded-lg font-bold"
            >
              get_started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                1 Free Credit Available
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
              Your personal <br />
              <span className="text-zinc-600 italic">6-agent blog team.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-md leading-relaxed mb-10">
              Generate publication-ready blogs with real-time internet research.
              No more generic AI fluff—just high-quality content backed by
              facts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform"
              >
                write_my_first_blog →
              </Link>
            </div>
          </div>
          <Terminal />
        </div>
      </section>

      {/* USE CASES - "WHAT CAN IT DO?" */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0b0b0d]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="p-10 bg-[#0f0f12] border border-white/5 rounded-3xl hover:border-white/10 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                  {uc.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {uc.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - "THE TEAM" */}
      <section id="how" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.4em]">
              the_process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-4">
              One prompt. Six agents.
            </h2>
            <p className="text-zinc-500 mt-4 max-w-xl text-sm">
              Instead of one single AI call, your blog moves through a
              professional pipeline. Each agent focuses on one job to ensure the
              highest quality.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="p-6 bg-[#0f0f12] border border-white/5 rounded-2xl text-center group hover:border-white/20 transition-all"
              >
                <div className={`text-[10px] font-mono mb-4 ${step.color}`}>
                  {step.id}
                </div>
                <h4 className="text-white font-bold mb-2">{step.name}</h4>
                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                  {step.task}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0b0b0d]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 text-white font-bold mb-4">
              <Globe className="w-5 h-5 text-emerald-400" /> Live Web Search
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Our agents use Tavily to find the latest news and facts, so your
              blog isn't stuck with outdated data.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 text-white font-bold mb-4">
              <MessageSquare className="w-5 h-5 text-indigo-400" /> Human
              Approval
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The pipeline pauses after the outline. You review and approve the
              plan before the writing starts.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 text-white font-bold mb-4">
              <ShieldCheck className="w-5 h-5 text-orange-400" /> Quality Audit
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              If the final blog doesn't meet our quality score of 7.0/10, the
              agents automatically rewrite it.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
              Usage based. No monthly fees.
            </h2>
            <p className="text-zinc-500 mt-4 font-mono text-xs uppercase tracking-widest">
              Buy credits. Use them anytime. They never expire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "₹99", tokens: 5, highlight: false },
              { name: "Pro", price: "₹249", tokens: 15, highlight: true },
              { name: "Power", price: "₹499", tokens: 35, highlight: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`p-10 rounded-3xl border flex flex-col transition-all ${p.highlight ? "bg-white text-black border-white scale-105 z-10" : "bg-[#0f0f12] border-white/10 text-white"}`}
              >
                <h4 className="text-xl font-bold mb-2 uppercase font-mono tracking-widest text-xs opacity-50">
                  {p.name}
                </h4>
                <div className="text-5xl font-bold tracking-tighter mb-4">
                  {p.price}
                </div>
                <p className="text-xs font-mono mb-8 opacity-60 uppercase tracking-widest">
                  {p.tokens} generation credits
                </p>
                <Link
                  href="/register"
                  className={`w-full py-4 font-mono font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl text-center transition-all ${p.highlight ? "bg-black text-white" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
                >
                  buy_{p.name.toLowerCase()}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT BUILDER */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
          Built by{" "}
          <a
            href="https://thissidemayur.me"
            className="text-zinc-400 hover:text-white underline"
          >
            Mayur Pal
          </a>{" "}
          · LPU CSE '27 · 2026
        </p>
      </footer>
    </div>
  );
}
