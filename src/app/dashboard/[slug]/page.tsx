"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePipeline } from "@/hooks/usePipeline";
import { AgentThinking } from "@/components/dashboard/core/AgentThinking";
import { BlogOutput } from "@/components/dashboard/core/Blogoutput";
import { TopicInput } from "@/components/dashboard/core/TopicInput";
import { PipelineLoader } from "@/components/dashboard/core/PipelineLoader";
import { BuyCreditsModal } from "@/components/payment/buyCreditsModal";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { extractMarkdown } from "@/lib/slug";
import { ArrowLeft, Clock, Hash, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SavedBlog {
  id: string;
  slug: string;
  topic: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
}

// ── Saved view ────────────────────────────────────────────────────────────────
function SavedBlogView({ blog }: { blog: SavedBlog }) {
  return (
    <div
      className="h-full overflow-y-auto bg-[#09090b]"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Back */}
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={11} /> back to history
        </Link>

        {/* Meta */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-indigo-400/60 bg-indigo-500/8 border border-indigo-500/15 px-2.5 py-1 rounded-full">
            {blog.topic}
          </div>
          <h1 className="text-[1.35rem] font-semibold text-zinc-100 leading-snug tracking-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-600">
              <Clock size={11} />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-600">
              <Hash size={11} /> {blog.wordCount.toLocaleString()} words
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600">
              <CheckCircle2 size={11} /> saved
            </span>
          </div>
        </div>

        <BlogOutput
          content={blog.content}
          isStreaming={false}
          slug={blog.slug}
        />
      </div>
    </div>
  );
}

// ── Approval banner ───────────────────────────────────────────────────────────
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
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-amber-500/20 bg-amber-500/[0.04] overflow-hidden">
      {/* Top accent */}
      <div className="h-px w-full bg-amber-500/30" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
            style={{ animation: "pulse-dot 1.2s ease infinite" }}
          />
          <span className="text-xs font-mono text-amber-400/90">
            outline ready — review before writing starts
          </span>
        </div>

        <div className="rounded-lg border border-white/[0.05] bg-black/25 p-4 mb-4">
          <p className="text-sm font-semibold text-zinc-200 mb-1 leading-snug">
            {plan.title}
          </p>
          <p className="text-[10px] font-mono text-zinc-600 mb-4">
            {plan.sections.length} sections · ~{plan.estimated_total_words}{" "}
            words
          </p>
          <div className="space-y-2">
            {plan.sections.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[9px] font-mono text-zinc-700 shrink-0 mt-[3px] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[11px] text-zinc-400 leading-snug">
                  {s.heading}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => approve(true)}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer"
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
            className="px-4 py-2 rounded-lg text-[11px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all"
            style={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── User bubble ───────────────────────────────────────────────────────────────
function UserBubble({ topic }: { topic: string }) {
  return (
    <div className="flex justify-end w-full max-w-2xl mx-auto">
      <div
        className="max-w-[82%] px-4 py-3 rounded-2xl rounded-tr-md text-sm text-zinc-200 leading-relaxed"
        style={{
          background: "linear-gradient(135deg, #1a1a22, #16161e)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {topic}
      </div>
    </div>
  );
}

// ── Done banner ───────────────────────────────────────────────────────────────
function DoneBanner({ words }: { words: number }) {
  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-2xl mx-auto py-2">
      <span className="h-px flex-1 bg-emerald-500/10" />
      <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600/80">
        <CheckCircle2 size={10} />
        generation complete · {words.toLocaleString()} words
      </span>
      <span className="h-px flex-1 bg-emerald-500/10" />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SlugPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { state, start, stop } = usePipeline();

  const topicFromUrl = searchParams.get("topic");

  const [mode, setMode] = useState<"init" | "live" | "saved">("init");
  const [savedBlog, setSavedBlog] = useState<SavedBlog | null>(null);
  const [topic, setTopic] = useState("");
  const [approvalDone, setApprovalDone] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const startedRef = useRef(false);
  const savedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = state.agents.editor?.status === "running";
  const hasBlog = state.blog.length > 0;
  const blogWords = hasBlog
    ? state.blog.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Auto scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (state.loading || state.running || hasBlog) {
      el.scrollTop = el.scrollHeight;
    }
  }, [state.blog, state.running, state.loading]);

  // Mount — decide live vs saved
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (topicFromUrl) {
      setTopic(topicFromUrl);
      setMode("live");
      start(topicFromUrl);
    } else {
      fetch(`/api/user/blogs/${slug}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.blog) {
            setSavedBlog(d.blog);
            setMode("saved");
          } else router.replace("/dashboard/new");
        })
        .catch(() => router.replace("/dashboard/new"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save on completion
  useEffect(() => {
    if (!state.done || !hasBlog || savedRef.current || mode !== "live") return;
    savedRef.current = true;
    const po = state.agents.planner?.output as { title?: string } | undefined;
    fetch("/api/user/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title: po?.title ?? topic,
        content: extractMarkdown(state.blog),
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.slug && d.slug !== slug) router.replace(`/dashboard/${d.slug}`);
      })
      .catch(console.error);
  }, [state.done]);

  // Credits error
  useEffect(() => {
    if (state.error === "INSUFFICIENT_CREDITS") setShowBuyModal(true);
  }, [state.error]);

  if (mode === "saved" && savedBlog) return <SavedBlogView blog={savedBlog} />;

  const busy = state.loading || state.running;

  return (
    <div className="h-full bg-[#09090b] flex flex-col">
      {/* Scrollable conversation */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-40 px-4"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="max-w-2xl mx-auto py-10 space-y-4">
          {/* Initial loading */}
          {mode === "init" && !topic && (
            <div className="flex justify-center py-24">
              <div
                className="w-4 h-4 border border-white/10 border-t-white/30 rounded-full"
                style={{ animation: "spin 0.8s linear infinite" }}
              />
            </div>
          )}

          {/* User bubble */}
          {topic && <UserBubble topic={topic} />}

          {/* Pipeline loader — covers the 30s gap */}
          {state.loading && <PipelineLoader />}

          {/* Error */}
          {state.error && state.error !== "INSUFFICIENT_CREDITS" && (
            <div className="w-full max-w-2xl mx-auto rounded-xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3">
              <p className="text-[11px] font-mono text-red-400/90">
                error: {state.error}
              </p>
            </div>
          )}

          {/* Agent panels — appear progressively */}
          {(state.running || state.done) && (
            <AgentThinking agents={state.agents} />
          )}

          {/* Approval */}
          {state.awaitingApproval && state.plannerOutput && !approvalDone && (
            <ApprovalBanner
              plan={state.plannerOutput}
              runId={state.runId}
              onDone={() => setApprovalDone(true)}
            />
          )}

          {/* Done banner */}
          {state.done && hasBlog && <DoneBanner words={blogWords} />}

          {/* Blog output */}
          {hasBlog && (
            <BlogOutput
              content={state.blog}
              isStreaming={isStreaming}
              slug={slug}
            />
          )}

          <div className="h-4" />
        </div>
      </div>

      {/* Fixed input */}
      <TopicInput
        value=""
        onChange={() => {}}
        onSubmit={() => router.push("/dashboard/new")}
        disabled={busy}
        onStop={stop}
        isRunning={state.running}
        isLoading={state.loading}
        centered={false}
      />

      <BuyCreditsModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        userEmail={user?.primaryEmailAddress?.emailAddress}
        userName={user?.fullName ?? undefined}
        onSuccess={() => {
          toast.success("Credits added!", { duration: 2000 });
          setShowBuyModal(false);
        }}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
