"use client";

import { useRef, useLayoutEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface TopicInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  onStop?: () => void;
  isRunning: boolean;
}

export function TopicInput({
  value,
  onChange,
  onSubmit,
  disabled,
  onStop,
  isRunning,
}: TopicInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter submits, Shift+Enter adds newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim().length >= 5) onSubmit();
    }
  };

  const canSubmit = value.trim().length >= 5 && !isRunning;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pb-6 px-4">
      <div
        className={cn(
          "w-full max-w-2xl rounded-2xl border bg-zinc-900 shadow-2xl transition-all duration-200",
          isRunning
            ? "border-zinc-700"
            : "border-zinc-700 focus-within:border-zinc-500",
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={isRunning}
          placeholder="What do you want to write about?"
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent px-4 pt-4 pb-2",
            "text-sm text-zinc-100 placeholder-zinc-500",
            "outline-none font-sans leading-relaxed",
            "min-h-[52px] max-h-[200px] overflow-y-auto",
            isRunning && "opacity-40 cursor-not-allowed",
          )}
          style={{ scrollbarWidth: "none" }}
        />

        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <span className="text-xs font-mono text-zinc-600 select-none">
            {isRunning
              ? "pipeline running..."
              : "Enter to generate · Shift+Enter for newline"}
          </span>

          {isRunning ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-600 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-400 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-sm bg-zinc-300 inline-block" />
              stop
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer",
                canSubmit
                  ? "bg-white text-black hover:bg-zinc-100"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700",
              )}
            >
              generate
              <span className="opacity-50 text-[10px]">↵</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}