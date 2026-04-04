"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePipeline } from "@/hooks/usePipeline";
import { AgentThinking } from "./AgentThinking";
import { BlogOutput } from "./Blogoutput";
import { TopicInput } from "./TopicInput";
import { BuyCreditsModal } from "@/components/payment/buyCreditsModal";

function topicToSlug(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function UserBubble({ topic }: { topic: string }) {
  return (
    <div className="flex justify-end w-full max-w-2xl mx-auto">
      <div className="max-w-[85%] bg-zinc-800 border border-white/5 rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm text-zinc-200 leading-relaxed">{topic}</p>
      </div>
    </div>
  );
}

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

// ── Main shell ────────────────────────────────────────────────────────────────
export function PipelineShell() {
  const { state, start, stop } = usePipeline();
  const { user } = useUser();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [submittedTopic, setSubmittedTopic] = useState("");
  const [approvalDone, setApprovalDone] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = state.agents.editor?.status === "running";
  const hasBlog = state.blog.length > 0;
  const showCreditsError = state.error === "INSUFFICIENT_CREDITS";

  // ✅ Derived slug (NO STATE, NO EFFECT)
  const plannerOutput = state.agents.planner?.output as {
    slug?: string;
    title?: string;
  } | null;

  const slug =
    plannerOutput?.slug ??
    (plannerOutput?.title
      ? topicToSlug(plannerOutput.title)
      : topicToSlug(submittedTopic));

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current && (state.running || hasBlog)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.blog, state.running, hasBlog]);

  // Open buy modal
  useEffect(() => {
    if (state.error === "INSUFFICIENT_CREDITS") {
      function showmodal(){
        setShowBuyModal(true);
      }
      showmodal()
    }
  }, [state.error]);

  // Save blog
  useEffect(() => {
    if (state.done && hasBlog && plannerOutput) {
      fetch("/api/user/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: submittedTopic,
          title: plannerOutput.title ?? submittedTopic,
          content: state.blog,
          slug,
        }),
      }).catch(console.error);
    }
  }, [state.done]);

  const handleStart = () => {
    if (topic.trim().length < 5 || state.running) return;

    const t = topic.trim();
    setSubmittedTopic(t);
    setTopic("");
    setApprovalDone(false);

    start(t);
  };

  function handlePaymentSuccess() {
    toast.success("Credits added!", {
      description: "Your balance has been updated.",
      duration: 2000,
    });
    setShowBuyModal(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="h-full bg-[#09090b] flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-40 px-4"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="max-w-2xl mx-auto py-8 space-y-5">
          {submittedTopic && <UserBubble topic={submittedTopic} />}

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
            <BlogOutput
              content={state.blog}
              isStreaming={isStreaming}
              slug={slug}
            />
          )}

          <div className="h-2" />
        </div>
      </div>

      <TopicInput
        value={topic}
        onChange={setTopic}
        onSubmit={handleStart}
        disabled={state.running}
        onStop={stop}
        isRunning={state.running}
      />

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
