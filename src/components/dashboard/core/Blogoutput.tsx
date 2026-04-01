"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface BlogOutputProps {
  content: string;
  isStreaming: boolean;
}

export function BlogOutput({ content, isStreaming }: BlogOutputProps) {
  const [tab, setTab] = useState<"preview" | "raw">("preview");
  const [copied, setCopied] = useState(false);
  const rawRef = useRef<HTMLDivElement>(null);

  // Auto scroll raw view during streaming
  useEffect(() => {
    if (tab === "raw" && isStreaming && rawRef.current) {
      rawRef.current.scrollTop = rawRef.current.scrollHeight;
    }
  }, [content, tab, isStreaming]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tab bar — same pattern as Claude */}
      <div className="flex items-center border-b border-white/5 mb-0">
        <div className="flex gap-0">
          {(["preview", "raw"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 text-xs font-mono transition-all cursor-pointer",
                "border-b-2",
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

        {/* Word count */}
        <span className="text-[10px] font-mono text-zinc-700 mr-3">
          {wordCount} words
        </span>

        {/* Copy button */}
        <button
          onClick={copy}
          className={cn(
            "text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all cursor-pointer mr-1 mb-0.5",
            copied
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              : "text-zinc-500 border-zinc-700 hover:text-zinc-300 hover:border-zinc-500",
          )}
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      {/* Content area */}
      <div className="rounded-b-xl rounded-tr-xl border border-t-0 border-white/5 bg-zinc-900/40">
        {tab === "preview" ? (
          // Markdown rendered — same prose style as GitHub README
          <div
            className="px-6 py-5 overflow-y-auto max-h-[560px]"
            style={{ scrollbarWidth: "thin" }}
          >
            <div
              className={cn(
                // Prose styles matching GitHub markdown
                "prose prose-sm prose-invert max-w-none",
                "prose-headings:font-semibold prose-headings:text-zinc-100 prose-headings:tracking-tight",
                "prose-h1:text-xl prose-h1:mb-3",
                "prose-h2:text-base prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-1.5",
                "prose-h3:text-sm prose-h3:text-zinc-200",
                "prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-sm",
                "prose-li:text-zinc-400 prose-li:text-sm",
                "prose-strong:text-zinc-200 prose-strong:font-semibold",
                "prose-code:text-indigo-400 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono",
                "prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-lg",
                "prose-blockquote:border-l-2 prose-blockquote:border-zinc-600 prose-blockquote:text-zinc-500 prose-blockquote:not-italic",
                "prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline",
                "prose-table:text-xs prose-th:text-zinc-300 prose-td:text-zinc-400 prose-th:border prose-th:border-white/10 prose-td:border prose-td:border-white/5",
                "prose-hr:border-white/10",
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
            {/* Blinking cursor while streaming */}
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-4 bg-zinc-300 ml-1 align-text-bottom"
                style={{ animation: "blink 0.9s step-end infinite" }}
              />
            )}
          </div>
        ) : (
          // Raw markdown — plain text like GitHub raw view
          <div
            ref={rawRef}
            className="px-6 py-5 overflow-y-auto max-h-[560px]"
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
