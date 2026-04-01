"use client";
// src/app/dashboard/history/page.tsx

import { useEffect, useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  Hash,
  BookOpen,
} from "lucide-react";

interface BlogPost {
  id: string;
  topic: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
}

// ── Skeleton ─────────────────────────────────────────────────
function HistorySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div
                className={`h-4 rounded-full bg-white/10 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`}
              />
              <div className="h-3 w-1/3 rounded-full bg-white/[0.06]" />
            </div>
            <div className="h-3 w-20 rounded-full bg-white/10 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-white/20" />
      </div>
      <div className="text-center">
        <p className="text-sm text-white/40">No blogs generated yet</p>
        <p className="text-xs text-white/20 mt-1">
          Your generated blogs will appear here
        </p>
      </div>
    </div>
  );
}

// ── Blog card ─────────────────────────────────────────────────
function BlogCard({ blog }: { blog: BlogPost }) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(blog.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format markdown content for display — simple line breaks
  const previewText = blog.content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .slice(0, 220);

  return (
    <div
      className={`
        rounded-2xl border transition-all duration-200
        ${
          expanded
            ? "border-violet-500/20 bg-violet-500/[0.04]"
            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.035]"
        }
      `}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="min-w-0 flex-1 space-y-2">
            {/* Topic pill */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-violet-400/70 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full truncate max-w-[260px]">
                {blog.topic}
              </span>
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-white/80 leading-snug">
              {blog.title}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-white/25" />
                <span className="text-xs text-white/30">
                  {formattedDate} · {formattedTime}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-white/25" />
                <span className="text-xs text-white/30">
                  {blog.wordCount.toLocaleString()} words
                </span>
              </div>
            </div>
          </div>

          {/* Expand toggle */}
          <div className="shrink-0 w-7 h-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center mt-0.5">
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-white/40" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            )}
          </div>
        </div>

        {/* Preview — only when collapsed */}
        {!expanded && (
          <p className="mt-3 text-xs text-white/25 font-mono leading-relaxed line-clamp-2">
            {previewText}…
          </p>
        )}
      </button>

      {/* Full content — expanded */}
      {expanded && (
        <div className="px-5 pb-5">
          <div className="h-px bg-white/[0.06] mb-4" />
          <div
            className="
              prose prose-invert prose-sm max-w-none
              prose-headings:text-white/80 prose-headings:font-semibold
              prose-p:text-white/50 prose-p:leading-relaxed
              prose-strong:text-white/70
              prose-code:text-violet-300 prose-code:bg-violet-500/10 prose-code:px-1 prose-code:rounded
              prose-ul:text-white/50 prose-ol:text-white/50
              prose-li:marker:text-violet-400/50
            "
            // We render as plain pre-formatted text here.
            // Swap with react-markdown if you want full markdown rendering.
          >
            <pre className="whitespace-pre-wrap font-sans text-xs text-white/40 leading-relaxed">
              {blog.content}
            </pre>
          </div>

          {/* Copy button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(blog.content);
            }}
            className="mt-4 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg"
          >
            <FileText className="w-3.5 h-3.5" />
            Copy content
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function HistoryPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/blogs")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.blogs) setBlogs(d.blogs);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0f]">
      {/* subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">History</h1>
            <p className="text-sm text-white/40 mt-1">
              {loading
                ? "Loading..."
                : `${blogs.length} blog${blogs.length === 1 ? "" : "s"} generated`}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <HistorySkeleton />
        ) : blogs.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
