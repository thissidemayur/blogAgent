"use client";

import { useState } from "react";
import { usePipeline, AGENT_ORDER } from "@/hooks/usePipeline";
import { AgentThinking } from "./AgentThinking";
import { BlogOutput } from "./Blogoutput";
import { TopicInput } from "./TopicInput";

// Approval banner — shown between planner done and writer start
function ApprovalBanner({
  plan,
  runId,
  onDone,
}: {
  plan: {
    title: string;
    sections: { heading: string }[];
    estimated_total_words: number;
  };
  runId: string;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const approve = async (approved: boolean) => {
    setLoading(true);
    await fetch("/api/pipeline/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, approved }),
    });
    onDone();
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs font-mono text-amber-400">
          outline_ready — approve before writing starts
        </span>
      </div>

      {/* Plan preview */}
      <div className="bg-black/20 rounded-lg border border-white/5 p-4 mb-4">
        <p className="text-sm font-semibold text-zinc-200 mb-1">{plan.title}</p>
        <p className="text-xs font-mono text-zinc-600 mb-3">
          {plan.sections.length} sections · ~{plan.estimated_total_words} words
        </p>
        <div className="space-y-1">
          {plan.sections.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-[10px] font-mono text-zinc-700 shrink-0 mt-px">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-zinc-400">{s.heading}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => approve(true)}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer"
          style={{
            background: loading ? "#27272a" : "#10b981",
            color: loading ? "#52525b" : "#000",
            border: "none",
          }}
        >
          {loading ? "approving..." : "approve_and_write"}
        </button>
        <button
          onClick={() => approve(false)}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
          style={{ background: "#18181b", border: "1px solid #27272a" }}
        >
          cancel
        </button>
      </div>
    </div>
  );
}

// Empty state — shown before any generation
function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const suggestions = [
    "How Docker Model Runner simplifies local AI development",
    "Getting started with OpenAI Agents SDK in TypeScript",
    "Building a production SaaS with Next.js 15 and Clerk",
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-200 mb-2 tracking-tight">
          What should the agents write?
        </h1>
        <p className="text-sm text-zinc-600 font-mono">
          6 agents · think → research → plan → write → edit → review
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="text-left px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 text-xs text-zinc-500 hover:text-zinc-300 transition-all font-mono cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Insufficient credits banner
function CreditsBanner() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
      <p className="text-sm text-zinc-300 mb-1">You have no credits left.</p>
      <p className="text-xs text-zinc-600 mb-4 font-mono">
        Purchase a token pack to continue generating blogs.
      </p>
      <a
        href="/credits"
        className="inline-block px-5 py-2 rounded-lg bg-white text-black text-xs font-mono font-semibold hover:bg-zinc-100 transition-all"
      >
        buy_tokens →
      </a>
    </div>
  );
}

export function PipelineShell() {
  const { state, start, stop } = usePipeline();
  const [topic, setTopic] = useState("");
  const [approvalDone, setApprovalDone] = useState(false);

  const isStreaming = state.agents.editor?.status === "running";
  const hasBlog = state.blog.length > 0;
  const isIdle = !state.running && !state.done && !state.error;
  const showCreditsError = state.error === "INSUFFICIENT_CREDITS";

  const handleStart = () => {
    if (topic.trim().length < 5 || state.running) return;
    setApprovalDone(false);
    start(topic.trim());
  };

  const handleSuggestion = (s: string) => setTopic(s);

  return (
    // Full height, scrollable content area, bottom-padded for fixed input
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Thin top bar */}
      <div className="h-11 shrink-0 border-b border-white/[0.04] flex items-center px-5 justify-between">
        <span className="font-mono text-xs text-zinc-600">
          <span className="text-zinc-400">blogoAIagento</span>
          <span className="mx-2 text-zinc-700">/</span>
          generate
        </span>

        <div className="flex items-center gap-3">
          {/* Running agent label */}
          {state.running && (
            <span className="text-[10px] font-mono text-zinc-600">
              {AGENT_ORDER.find((a) => state.agents[a].status === "running") ??
                "..."}{" "}
              running
            </span>
          )}
          {state.done && (
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              complete
            </span>
          )}
          {/* Credits link */}
          <a
            href="/credits"
            className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 border border-white/5 px-2 py-0.5 rounded transition-colors"
          >
            credits
          </a>
        </div>
      </div>

      {/* Scrollable main content — padded bottom for fixed input */}
      <div className="flex-1 overflow-y-auto pb-36 px-4">
        <div className="max-w-2xl mx-auto py-8 space-y-4">
          {/* Idle empty state */}
          {isIdle && <EmptyState onSuggestion={handleSuggestion} />}

          {/* Credits error */}
          {showCreditsError && <CreditsBanner />}

          {/* Generic error */}
          {state.error && !showCreditsError && (
            <div className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-xs font-mono text-red-400">
                error: {state.error}
              </p>
            </div>
          )}

          {/* Agent thinking panels — Claude-style */}
          {(state.running || state.done) && (
            <AgentThinking agents={state.agents} />
          )}

          {/* Approval banner — between planner and writer */}
          {state.awaitingApproval && state.plannerOutput && !approvalDone && (
            <ApprovalBanner
              plan={state.plannerOutput}
              runId={state.runId}
              onDone={() => setApprovalDone(true)}
            />
          )}

          {/* Blog output — streams in, then stays */}
          {hasBlog && (
            <BlogOutput content={state.blog} isStreaming={isStreaming} />
          )}

          {/* Spacer so last item isn't hidden under fixed input */}
          <div className="h-4" />
        </div>
      </div>

      {/* Fixed bottom input — Claude style */}
      <TopicInput
        value={topic}
        onChange={setTopic}
        onSubmit={handleStart}
        disabled={state.running}
        onStop={stop}
        isRunning={state.running}
      />
    </div>
  );
}
