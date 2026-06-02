"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Hash, ChevronRight } from "lucide-react";

interface BlogSummary {
  id: string;
  slug: string;
  topic: string;
  title: string;
  summary: string;
  wordCount: number;
  createdAt: string;
}

function HistorySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="space-y-3">
            <div
              className={`h-3 rounded-full bg-white/10 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`}
            />
            <div className="h-3 w-full rounded-full bg-white/[0.06]" />
            <div className="h-3 w-2/3 rounded-full bg-white/[0.06]" />
            <div className="flex gap-3 mt-1">
              <div className="h-2.5 w-20 rounded-full bg-white/[0.05]" />
              <div className="h-2.5 w-16 rounded-full bg-white/[0.05]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyHistory() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-white/20" />
      </div>
      <div className="text-center">
        <p className="text-sm text-white/40">No blogs generated yet</p>
        <p className="text-xs text-white/20 mt-1">
          Your generated blogs will appear here
        </p>
      </div>
      <button
        onClick={() => router.push("/dashboard/new")}
        className="text-xs text-violet-400 hover:text-violet-300 border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 px-4 py-2 rounded-xl transition-all"
      >
        Generate your first blog
      </button>
    </div>
  );
}

function BlogCard({ blog }: { blog: BlogSummary }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/dashboard/${blog.slug}`)}
      className="
        w-full text-left rounded-2xl border border-white/10
        bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15]
        transition-all duration-150 p-5 group
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          {/* Topic pill */}
          <span className="inline-block text-[11px] font-mono text-violet-400/70 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full truncate max-w-[280px]">
            {blog.topic}
          </span>

          {/* Title */}
          <p className="text-sm font-medium text-white/75 leading-snug group-hover:text-white/90 transition-colors">
            {blog.title}
          </p>

          {/* Summary — plain text, no markdown */}
          {blog.summary && (
            <p className="text-xs text-white/25 leading-relaxed line-clamp-2">
              {blog.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 pt-0.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-white/20" />
              <span className="text-[11px] text-white/25">
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="w-3 h-3 text-white/20" />
              <span className="text-[11px] text-white/25">
                {blog.wordCount.toLocaleString()} words
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 shrink-0 mt-1 transition-colors" />
      </div>
    </button>
  );
}

export default function HistoryPage() {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
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
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="text-sm text-white/40 mt-1">
            {loading
              ? "Loading..."
              : `${blogs.length} blog${blogs.length === 1 ? "" : "s"} generated`}
          </p>
        </div>

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
