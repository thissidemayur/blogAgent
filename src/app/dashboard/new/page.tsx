"use client";
// Entry point for blog generation.
// User types topic → we generate a slug client-side → navigate to /dashboard/[slug]
// The [slug] page handles the actual pipeline.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import { ArrowRight, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "How Docker Model Runner simplifies local AI development",
  "Getting started with OpenAI Agents SDK in TypeScript",
  "Building a production SaaS with Next.js 15 and Clerk",
  "Understanding RAG pipelines for production LLM apps",
  "Web scraping at scale with Playwright and proxies",
];

export default function NewBlogPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  function handleStart(t: string) {
    const trimmed = t.trim();
    if (trimmed.length < 5 || loading) return;

    setLoading(true);

    // Generate a temporary slug client-side from the topic.
    // We use Date.now() as the suffix here — the server will
    // overwrite with the real cuid-based slug when saving.
    // The URL just needs to be unique per session.
    const tempSlug = generateSlug(trimmed, Date.now().toString(36));

    // Store the topic in sessionStorage so the [slug] page can read it
    // and start the pipeline immediately on mount.
    sessionStorage.setItem(`blog-topic:${tempSlug}`, trimmed);

    router.push(`/dashboard/${tempSlug}`);
  }

  return (
    <div className="h-full bg-[#09090b] flex flex-col items-center justify-center px-4">
      {/* subtle grid bg */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-xl space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            What should the agents write?
          </h1>
          <p className="text-sm text-white/30 font-mono">
            6 agents · think → research → plan → write → edit → review
          </p>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStart(topic);
            }}
            placeholder="Enter a topic or paste a brief..."
            autoFocus
            className="
              w-full px-5 py-4 pr-14 rounded-2xl
              bg-white/[0.04] border border-white/10
              text-white placeholder:text-white/25
              text-sm focus:outline-none focus:border-violet-500/50
              focus:bg-white/[0.06] transition-all
            "
          />
          <button
            onClick={() => handleStart(topic)}
            disabled={topic.trim().length < 5 || loading}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              w-9 h-9 rounded-xl
              bg-violet-600 hover:bg-violet-500
              disabled:bg-white/5 disabled:cursor-not-allowed
              flex items-center justify-center
              transition-all
            "
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-white/20 font-mono px-1">Try these</p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStart(s)}
              disabled={loading}
              className="
                w-full text-left px-4 py-3 rounded-xl
                border border-white/[0.06] bg-white/[0.02]
                hover:bg-white/[0.05] hover:border-white/10
                text-xs text-white/35 hover:text-white/60
                transition-all font-mono
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
