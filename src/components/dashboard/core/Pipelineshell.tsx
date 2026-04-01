"use client";
// src/components/dashboard/core/PipelineShell.tsx
//
// CHANGES from original:
// 1. Removed internal h-11 top bar — layout.tsx handles it now
// 2. Fixed credits link: /credits → /dashboard/credits
// 3. Removed min-h-screen — layout controls height now
// 4. Added BuyCreditsModal wired to INSUFFICIENT_CREDITS error

import { useEffect, useState } from "react";
import { usePipeline, AGENT_ORDER } from "@/hooks/usePipeline";
import { AgentThinking } from "./AgentThinking";
import { BlogOutput } from "./Blogoutput";
import { TopicInput } from "./TopicInput";
import { BuyCreditsModal } from "@/components/payment/buyCreditsModal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export function PipelineShell() {
  const { state, start, stop } = usePipeline();
  const { user } = useUser();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [approvalDone, setApprovalDone] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const isStreaming = state.agents.editor?.status === "running";
  const hasBlog = state.blog.length > 0;
  const isIdle = !state.running && !state.done && !state.error;
  const showCreditsError = state.error === "INSUFFICIENT_CREDITS";

  // Open buy modal when pipeline returns 402
  useEffect(() => {
    if (state.error === "INSUFFICIENT_CREDITS") {
      function showmodal(){
        setShowBuyModal(true);
      }
      showmodal()
    }
  }, [state.error]);

  // Save blog to DB when pipeline completes
  useEffect(() => {
    if (state.done && hasBlog && state.agents.planner?.output) {
      const plannerOutput = state.agents.planner.output as {
        title?: string;
      };
      fetch("/api/user/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title: plannerOutput.title ?? topic,
          content: state.blog,
        }),
      }).catch(console.error);
    }
  }, [state.done]);

  const handleStart = () => {
    if (topic.trim().length < 5 || state.running) return;
    setApprovalDone(false);
    start(topic.trim());
  };

  function handlePaymentSuccess(newBalance: number) {
    const creditsAdded = newBalance - 0; // approximate
    toast.success(`Credits added!`, {
      description: "Your balance has been updated.",
      duration: 2000,
    });
    setShowBuyModal(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    // No min-h-screen — layout controls height
    // h-full fills the main area given by layout
    <div className="h-full bg-[#09090b] flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-36 px-4">
        <div className="max-w-2xl mx-auto py-8 space-y-4">
          {isIdle && <EmptyState onSuggestion={setTopic} />}

          {/* Generic error — not credits */}
          {state.error && !showCreditsError && (
            <div className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-xs font-mono text-red-400">
                error: {state.error}
              </p>
            </div>
          )}

          {(state.running || state.done) && (
            <AgentThinking agents={state.agents} />
          )}

          {state.awaitingApproval && state.plannerOutput && !approvalDone && (
            <ApprovalBanner
              plan={state.plannerOutput}
              runId={state.runId}
              onDone={() => setApprovalDone(true)}
            />
          )}

          {hasBlog && (
            <BlogOutput content={state.blog} isStreaming={isStreaming} />
          )}

          <div className="h-4" />
        </div>
      </div>

      {/* Fixed bottom input */}
      <TopicInput
        value={topic}
        onChange={setTopic}
        onSubmit={handleStart}
        disabled={state.running}
        onStop={stop}
        isRunning={state.running}
      />

      {/* Buy credits modal — opens on 402 */}
      <BuyCreditsModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        userEmail={user?.primaryEmailAddress?.emailAddress}
        userName={user?.fullName ?? undefined}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
