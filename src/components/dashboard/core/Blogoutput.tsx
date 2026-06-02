"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BlogRenderer } from "../blog/BlogRenderer";

interface BlogOutputProps {
  content: string;
  isStreaming: boolean;
  slug?: string;
}

export function BlogOutput({ content, isStreaming, slug }: BlogOutputProps) {
  const [tab, setTab] = useState<"preview" | "raw">("preview");
  const [copied, setCopied] = useState(false);
  const rawRef = useRef<HTMLDivElement>(null);

  // Auto-scroll raw during streaming
  useEffect(() => {
    if (tab === "raw" && isStreaming && rawRef.current) {
      rawRef.current.scrollTop = rawRef.current.scrollHeight;
    }
  }, [content, tab, isStreaming]);

  const words = content.trim().split(/\s+/).filter(Boolean).length;

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Slug badge — shown above the blog */}
      {slug && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-[10px] font-mono text-zinc-600">slug:</span>
          <code className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {slug}
          </code>
          {isStreaming && (
            <span className="text-[10px] font-mono text-zinc-700 animate-pulse">
              streaming...
            </span>
          )}
        </div>
      )}

      {/* Tab toolbar — identical to GitHub's Preview / Code toggle */}
      <div className="flex items-center border-b border-white/5 bg-[#111113] rounded-t-xl px-2">
        <div className="flex">
          {(["preview", "raw"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2.5 text-xs font-mono transition-all cursor-pointer border-b-2",
                tab === t
                  ? "text-zinc-200 border-zinc-300"
                  : "text-zinc-600 border-transparent hover:text-zinc-400",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <span className="text-[10px] font-mono text-zinc-700 mr-3">
          {words}w
        </span>

        <button
          onClick={copy}
          className={cn(
            "text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all cursor-pointer mr-1",
            copied
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              : "text-zinc-500 border-zinc-700 hover:text-zinc-300 hover:border-zinc-500",
          )}
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      {/* Content */}
      <div className="border border-t-0 border-white/5 rounded-b-xl bg-zinc-950/60">
        {tab === "preview" ? (
          <div
            className="px-8 py-6 overflow-y-auto max-h-[600px]"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* GitHub README.md prose styles */}
            <div
              className={cn(
                "prose prose-sm prose-invert max-w-none",

                // Headings — GitHub uses a bottom border on h1/h2
                "prose-h1:font-bold prose-h1:text-[1.6rem] prose-h1:text-zinc-100 prose-h1:pb-3 prose-h1:border-b prose-h1:border-white/10 prose-h1:mb-4",
                "prose-h2:font-bold prose-h2:text-[1.2rem] prose-h2:text-zinc-100 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/8 prose-h2:mt-8 prose-h2:mb-3",
                "prose-h3:font-semibold prose-h3:text-[1rem] prose-h3:text-zinc-200 prose-h3:mt-6 prose-h3:mb-2",
                "prose-h4:font-semibold prose-h4:text-sm prose-h4:text-zinc-300",

                // Body text
                "prose-p:text-zinc-400 prose-p:leading-[1.75] prose-p:text-[0.9rem]",
                "prose-p:my-3",

                // Lists
                "prose-ul:text-zinc-400 prose-ul:text-sm prose-ul:leading-relaxed",
                "prose-ol:text-zinc-400 prose-ol:text-sm prose-ol:leading-relaxed",
                "prose-li:my-0.5",
                "prose-li:marker:text-zinc-600",

                // Inline code — GitHub green
                "prose-code:text-[#79c0ff] prose-code:bg-zinc-800/80 prose-code:px-[0.3em] prose-code:py-[0.1em] prose-code:rounded prose-code:text-[0.85em] prose-code:font-mono prose-code:border prose-code:border-white/5",
                "prose-code:before:content-none prose-code:after:content-none",

                // Code blocks
                "prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:text-sm",
                "prose-pre:my-4",

                // Blockquote
                "prose-blockquote:border-l-4 prose-blockquote:border-zinc-600 prose-blockquote:pl-4 prose-blockquote:text-zinc-500 prose-blockquote:not-italic prose-blockquote:bg-transparent",

                // Links
                "prose-a:text-[#58a6ff] prose-a:no-underline hover:prose-a:underline",

                // Strong / em
                "prose-strong:text-zinc-200 prose-strong:font-semibold",
                "prose-em:text-zinc-400",

                // Tables — GitHub style
                "prose-table:text-sm prose-table:w-full",
                "prose-thead:border-b prose-thead:border-white/10",
                "prose-th:text-zinc-200 prose-th:font-semibold prose-th:py-2 prose-th:px-3 prose-th:text-left",
                "prose-td:text-zinc-400 prose-td:py-2 prose-td:px-3 prose-td:border-b prose-td:border-white/5",
                "prose-tr:hover:prose-td:bg-white/[0.02]",

                // HR
                "prose-hr:border-white/10 prose-hr:my-6",

                // Images
                "prose-img:rounded-lg prose-img:border prose-img:border-white/10",
              )}
            >
              <BlogRenderer content={content} />
            </div>

            {/* Streaming cursor */}
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-4 bg-zinc-400 ml-1 align-text-bottom"
                style={{ animation: "blink 0.9s step-end infinite" }}
              />
            )}
          </div>
        ) : (
          <div
            ref={rawRef}
            className="px-6 py-5 overflow-y-auto max-h-[600px]"
            style={{ scrollbarWidth: "thin" }}
          >
            <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap break-words leading-[1.7]">
              {content}
              {isStreaming && (
                <span
                  className="text-zinc-300"
                  style={{ animation: "blink 0.9s step-end infinite" }}
                >
                  ▌
                </span>
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
