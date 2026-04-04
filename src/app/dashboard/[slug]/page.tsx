"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePipeline } from "@/hooks/usePipeline";
import { AgentThinking } from "@/components/dashboard/core/AgentThinking";
import { BlogOutput } from "@/components/dashboard/core/Blogoutput";
import { TopicInput } from "@/components/dashboard/core/TopicInput";
import { BuyCreditsModal } from "@/components/payment/buyCreditsModal";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { extractMarkdown } from "@/lib/slug";
import { ArrowLeft, Clock, Hash } from "lucide-react";
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

// ── Saved blog view ─────────────────────────────────────────────
function SavedBlogView({ blog }: { blog: SavedBlog }) {
  return (
    <div className="h-full overflow-y-auto bg-[#09090b]">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300"
        >
          <ArrowLeft size={12} />
          back to history
        </Link>

        <div className="space-y-2">
          <span className="text-[10px] font-mono text-indigo-400/70">
            {blog.topic}
          </span>

          <h1 className="text-xl font-semibold text-zinc-100">{blog.title}</h1>

          <div className="flex gap-4 text-xs text-zinc-600">
            <span>
              <Clock size={12} />{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-IN")}
            </span>
            <span>
              <Hash size={12} /> {blog.wordCount} words
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

// ── User bubble ────────────────────────────────────────────────
function UserBubble({ topic }: { topic: string }) {
  return (
    <div className="flex justify-end w-full max-w-2xl mx-auto">
      <div className="bg-zinc-800 px-4 py-3 rounded-2xl text-sm text-zinc-200">
        {topic}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function SlugPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const topicFromUrl = searchParams.get("topic");
  const runIdFromUrl = searchParams.get("runId");

  const { state, start, stop } = usePipeline();

  const [mode, setMode] = useState<"loading" | "live" | "saved">("loading");
  const [savedBlog, setSavedBlog] = useState<SavedBlog | null>(null);
  const [topic, setTopic] = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);

  const startedRef = useRef(false);
  const savedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = state.agents.editor?.status === "running";
  const hasBlog = state.blog.length > 0;

  // ── AUTO SCROLL ─────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current && (state.running || hasBlog)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.blog, state.running]);

  useEffect(() => {
    // ✅ LIVE MODE
    if (topicFromUrl && runIdFromUrl) {
      if (startedRef.current) return;

     function setTopicAndMode(){
       setTopic(topicFromUrl as string);
       setMode("live");

       start(topicFromUrl as string, runIdFromUrl as string); // MUST include runId

       startedRef.current = true;
       return;
     }
     setTopicAndMode()
    }

    // ✅ SAVED MODE
    fetch(`/api/user/blogs/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.blog) {
          setSavedBlog(d.blog);
          setMode("saved");
        } else {
          router.replace("/dashboard/new");
        }
      })
      .catch(() => router.replace("/dashboard/new"));
  }, [slug, topicFromUrl, runIdFromUrl]);

  // ── SAVE BLOG AFTER COMPLETION ──────────────────────────────
  useEffect(() => {
    if (!state.done || !hasBlog || savedRef.current || mode !== "live") return;

    savedRef.current = true;

    const plannerOutput = state.agents.planner?.output as
      | { title?: string }
      | undefined;

    const title = plannerOutput?.title ?? topic;
    const content = extractMarkdown(state.blog);

    fetch("/api/user/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, title, content }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.slug && d.slug !== slug) {
          router.replace(`/dashboard/${d.slug}`);
        }
      })
      .catch(console.error);
  }, [state.done]);

  // ── CREDIT ERROR ────────────────────────────────────────────
  useEffect(() => {
   function showmodal(){
     if (state.error === "INSUFFICIENT_CREDITS") {
       setShowBuyModal(true);
     }
   }
   showmodal()
  }, [state.error]);

  // ── SAVED VIEW ──────────────────────────────────────────────
  if (mode === "saved" && savedBlog) {
    return <SavedBlogView blog={savedBlog} />;
  }

  // ── LIVE VIEW ───────────────────────────────────────────────
  return (
    <div className="h-full bg-[#09090b] flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-44 px-4">
        <div className="max-w-2xl mx-auto py-8 space-y-4">
          {mode === "loading" && (
            <div className="flex justify-center py-20">
              <div className="w-5 h-5 border border-white/10 border-t-white/40 rounded-full animate-spin" />
            </div>
          )}

          {topic && <UserBubble topic={topic} />}

          {state.error && state.error !== "INSUFFICIENT_CREDITS" && (
            <div className="text-red-400 text-xs">error: {state.error}</div>
          )}

          {(state.running || state.done) && (
            <AgentThinking agents={state.agents} />
          )}

          {hasBlog && (
            <BlogOutput
              content={state.blog}
              isStreaming={isStreaming}
              slug={slug}
            />
          )}
        </div>
      </div>

      <TopicInput
        value=""
        onChange={() => {}}
        onSubmit={() => router.push("/dashboard/new")}
        disabled={state.running}
        onStop={stop}
        isRunning={state.running}
        centered={false}
        isLoading={false}
      />

      <BuyCreditsModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        userEmail={user?.primaryEmailAddress?.emailAddress}
        userName={user?.fullName ?? undefined}
        onSuccess={() => {
          toast.success("Credits added!");
          setShowBuyModal(false);
        }}
      />
    </div>
  );
}
