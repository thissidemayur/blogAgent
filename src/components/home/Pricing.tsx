import React from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";

/**
 * Pricing Component - Premium SaaS Edition
 * Optimized for Tailwind CSS v4
 *
 * Design Spec:
 * - Linear-inspired high-contrast "Spotlight" center card
 * - Sophisticated micro-interactions & depth layers
 * - Clear value hierarchy for developers and content ops
 */

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹99",
    tokens: 5,
    highlight: false,
    note: "Entry level",
    features: [
      "All 6 agents",
      "Markdown export",
      "SSE streaming",
      "Standard support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹249",
    tokens: 15,
    highlight: true,
    note: "Most Popular",
    features: [
      "All 6 agents",
      "Markdown export",
      "SSE streaming",
      "Priority support",
      "Human-in-the-loop review",
    ],
  },
  {
    id: "power",
    name: "Power",
    price: "₹499",
    tokens: 35,
    highlight: false,
    note: "High volume",
    features: [
      "All 6 agents",
      "Markdown export",
      "SSE streaming",
      "Priority support",
      "Bulk topic queue",
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-32 px-6 border-t border-white/5 bg-[#0B0F19] overflow-hidden"
    >
      {/* Dynamic Background Depth */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md transition-all hover:bg-white/[0.06] hover:border-white/20 group cursor-default">
            <CreditCard className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-200 transition-colors">
              transparent_pricing
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white tracking-[-0.04em] leading-[0.9] mb-10">
            Usage based. <br />
            <span className="text-zinc-600 italic">No monthly friction.</span>
          </h2>

          <p className="text-zinc-400 font-sans text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Scale your content pipeline on demand. Credits never expire and
            failed generations are instantly refunded to your balance.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`group relative p-10 rounded-[2.5rem] border transition-all duration-700 flex flex-col overflow-hidden ${
                p.highlight
                  ? "bg-white text-black border-white lg:scale-105 z-10 shadow-[0_0_80px_rgba(255,255,255,0.08)]"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20 hover:bg-white/[0.04] backdrop-blur-sm"
              }`}
            >
              {/* Highlight Label */}
              {p.highlight && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl flex items-center gap-2">
                  Popular
                </div>
              )}

              {/* Card Header */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:-rotate-3 ${p.highlight ? "bg-black/5 border-black/10 shadow-sm" : "bg-white/5 border-white/10"}`}
                  >
                    <Zap
                      className={`w-5 h-5 ${p.highlight ? "text-black" : "text-indigo-400"}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4
                      className={`text-[11px] font-mono font-bold uppercase tracking-[0.2em] ${p.highlight ? "text-zinc-500" : "text-zinc-600"}`}
                    >
                      {p.note}
                    </h4>
                    <p
                      className={`text-lg font-bold tracking-tight ${p.highlight ? "text-black" : "text-white"}`}
                    >
                      {p.name} Pack
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`text-6xl font-black tracking-[-0.06em] ${p.highlight ? "text-black" : "text-white"}`}
                  >
                    {p.price}
                  </span>
                </div>

                <p
                  className={`font-mono text-[11px] font-bold uppercase tracking-[0.15em] mt-3 ${p.highlight ? "text-zinc-600" : "text-zinc-500"}`}
                >
                  {p.tokens} generation_credits
                </p>
              </div>

              {/* Features List */}
              <ul className="flex-1 space-y-5 mb-12">
                {p.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider group/item"
                  >
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${p.highlight ? "bg-indigo-600/10" : "bg-emerald-500/10"}`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${p.highlight ? "text-indigo-600" : "text-emerald-500"}`}
                      />
                    </div>
                    <span
                      className={`${p.highlight ? "text-zinc-800" : "text-zinc-400"} group-hover/item:translate-x-1 transition-transform duration-300`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={`/register?plan=${p.id}`}
                className={`w-full py-5 font-mono font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl text-center transition-all active:scale-95 group/btn flex items-center justify-center gap-2 ${
                  p.highlight
                    ? "bg-black text-white hover:bg-zinc-900 shadow-xl"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span>buy_{p.id}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover/btn:translate-x-1 ${p.highlight ? "text-indigo-400" : "text-zinc-600"}`}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Policy Section */}
        <div className="mt-28 flex flex-col items-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-8 px-10 py-5 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-inner group transition-all hover:border-white/10">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                auto_refund_on_failure
              </span>
            </div>

            <div className="h-5 w-px bg-white/10 hidden md:block" />

            <div className="flex items-center gap-4">
              <Zap className="w-5 h-5 text-indigo-400 transition-transform group-hover:scale-110" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                permanent_lifetime_credits
              </span>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.4em]">
              enterprise_grade_security
            </p>
            <div className="flex items-center gap-8 grayscale brightness-75">
              <span className="font-mono text-[11px] font-bold text-zinc-400 tracking-tighter uppercase">
                Razorpay_Secure
              </span>
              <span className="font-mono text-[11px] font-bold text-zinc-400 tracking-tighter uppercase">
                PCI_DSS_Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
