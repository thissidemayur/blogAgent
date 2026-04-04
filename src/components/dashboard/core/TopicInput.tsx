"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, Square } from "lucide-react";

interface TopicInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  onStop?: () => void;
  isRunning: boolean;
  centered?: boolean;
  isLoading?: boolean;
}

export function TopicInput({
  value,
  onChange,
  onSubmit,
  disabled,
  onStop,
  isRunning,
  centered = false,
  isLoading = false,
}: TopicInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  // focus
  useEffect(() => {
    if (centered && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [centered]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isLoading && value.trim().length >= 5) {
        onSubmit();
      }
    }
  };

  const canSubmit = value.trim().length >= 5 && !isRunning && !isLoading;

  return (
    <div
      className={cn(
        "w-full z-40",
        centered
          ? "flex flex-col items-center justify-center"
          : "fixed bottom-0 inset-x-0 flex justify-center pb-5 px-4 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent pt-6",
      )}
    >
      <div className={cn("w-full px-4", centered ? "max-w-xl" : "max-w-2xl")}>
        {/* Card */}
        <div
          className={cn(
            "w-full rounded-2xl border bg-zinc-900 shadow-2xl transition-all duration-200",
            isRunning || isLoading
              ? "border-zinc-700"
              : "border-zinc-700 focus-within:border-zinc-500",
            centered && "shadow-[0_0_60px_rgba(99,102,241,0.08)]",
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            disabled={disabled || isLoading}
            placeholder={
              centered
                ? "What do you want to write about?"
                : "Start a new blog..."
            }
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent px-4 pt-4 pb-2",
              "text-sm text-zinc-100 placeholder-zinc-600",
              "outline-none font-sans leading-relaxed",
              "min-h-[52px] max-h-[200px] overflow-y-auto",
              (disabled || isLoading) && "opacity-50 cursor-not-allowed",
            )}
            style={{ scrollbarWidth: "none" }}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <span className="text-xs font-mono text-zinc-700 select-none">
              {isLoading
                ? "starting pipeline..."
                : isRunning
                  ? "pipeline running..."
                  : "Enter to generate · Shift+Enter for newline"}
            </span>

            {isRunning && !isLoading ? (
              <button
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-600 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-400 transition-all"
              >
                <Square size={10} fill="currentColor" />
                stop
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                  canSubmit
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed",
                )}
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                ) : (
                  <ArrowUp size={14} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Hint text (only visible in centered mode) */}
        {centered && (
          <p className="text-center text-[10px] font-mono text-zinc-700 mt-3">
            6 agents · think → research → plan → write → edit → review
          </p>
        )}
      </div>
    </div>
  );
}
