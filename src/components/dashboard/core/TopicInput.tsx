"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, Square, Loader } from "lucide-react";

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
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize — grows upward, capped at 200px
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  useEffect(() => {
    if (centered) ref.current?.focus();
  }, [centered]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  const busy = isRunning || isLoading;
  const canSubmit = value.trim().length >= 5 && !busy;

  const card = (
    <div
      className={cn(
        "relative w-full rounded-2xl transition-all duration-200",
        "bg-[#111116] border",
        busy
          ? "border-white/[0.06]"
          : "border-white/[0.08] focus-within:border-white/[0.16] focus-within:shadow-[0_0_0_1px_rgba(99,102,241,0.15)]",
        centered && "shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
      )}
    >
      {/* Subtle top shimmer when loading */}
      {isLoading && (
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, #6366f150, transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s linear infinite",
          }}
        />
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        disabled={busy}
        placeholder={
          centered ? "What do you want to write about?" : "New topic..."
        }
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent",
          "px-4 pt-[14px] pb-2",
          "text-sm text-zinc-100 placeholder-zinc-600",
          "outline-none leading-relaxed",
          "min-h-[48px] max-h-[200px] overflow-y-auto",
          busy && "cursor-not-allowed opacity-40",
        )}
        style={{ scrollbarWidth: "none" }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 gap-2">
        <span className="text-[10px] font-mono text-zinc-700 select-none">
          {isLoading
            ? "preparing pipeline..."
            : isRunning
              ? "pipeline running · Shift+Enter for newline"
              : "Enter ↵ to generate · Shift+Enter for newline"}
        </span>

        {/* Stop */}
        {isRunning && !isLoading ? (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono text-zinc-400 hover:text-zinc-200 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] transition-all"
          >
            <Square size={9} fill="currentColor" />
            stop
          </button>
        ) : (
          /* Send */
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg transition-all shrink-0",
              canSubmit
                ? "bg-white text-[#09090b] hover:bg-zinc-100 shadow-sm"
                : "bg-white/[0.04] text-zinc-700 cursor-not-allowed border border-white/[0.06]",
            )}
          >
            {isLoading ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <ArrowUp size={13} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );

  if (centered) {
    return (
      <div className="w-full max-w-xl mx-auto">
        {card}
        <p className="text-center text-[10px] font-mono text-zinc-700 mt-3 tracking-wide">
          think · research · plan · write · edit · review
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center px-4 pb-5">
      {/* Gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-transparent pointer-events-none" />
      <div className="relative w-full max-w-2xl">{card}</div>
    </div>
  );
}
