"use client";

import { useState } from "react";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AGENT_META,
  type AgentName,
  type AgentState,
} from "@/hooks/usePipeline";

interface AgentThinkingProps {
  agents: Record<AgentName, AgentState>;
}

function AgentPanel({ name, state }: { name: AgentName; state: AgentState }) {
  const [open, setOpen] = useState(false);
  const meta = AGENT_META[name];
  const isRunning = state.status === "running";
  const isDone = state.status === "done";
  const hasOutput = isDone && state.output != null;

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300 overflow-hidden",
        isRunning
          ? "border-white/10 bg-white/[0.025]"
          : "border-white/[0.05] bg-transparent",
      )}
    >
      {/* Running shimmer */}
      {isRunning && (
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${meta.color}70, transparent)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.8s linear infinite",
          }}
        />
      )}

      <button
        onClick={() => hasOutput && setOpen((o) => !o)}
        disabled={!hasOutput}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left",
          hasOutput && "cursor-pointer hover:bg-white/[0.02]",
          !hasOutput && "cursor-default",
        )}
      >
        {/* Chevron */}
        <span className="w-3 shrink-0 text-zinc-600">
          {hasOutput ? (
            open ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )
          ) : null}
        </span>

        {/* Pulse dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isRunning && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ backgroundColor: meta.color }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-2 w-2 border"
            style={{
              backgroundColor: isDone
                ? "#10b981"
                : isRunning
                  ? meta.color
                  : "transparent",
              borderColor: "transparent",
            }}
          />
        </span>

        {/* Icon */}
        <span
          className="font-mono text-xs w-4 shrink-0"
          style={{ color: meta.color }}
        >
          {isRunning ? (
            <Loader2 size={12} className="animate-spin inline" />
          ) : (
            meta.icon
          )}
        </span>

        {/* Label */}
        <span className="text-xs font-semibold text-zinc-300 flex-1">
          {meta.label}
        </span>

        {/* Running desc */}
        {isRunning && (
          <span className="text-[10px] font-mono text-zinc-600 animate-pulse hidden sm:block">
            {meta.desc}...
          </span>
        )}

        {/* Done badge */}
        {isDone && (
          <span className="text-[10px] font-mono text-emerald-500/70 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            done
          </span>
        )}
      </button>

      {/* Expandable output — Claude-style thinking panel */}
      {open && hasOutput && (
        <div className="border-t border-white/5 mx-3 mb-3">
          <div className="overflow-y-auto max-h-56 rounded-lg bg-black/40 p-3 mt-2">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
              agent_output
            </p>
            <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap break-words leading-relaxed">
              {JSON.stringify(state.output, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function AgentThinking({ agents }: AgentThinkingProps) {
  // Only show agents that are running or done — hide pending ones completely
  // This mirrors how Claude shows thinking: only what is currently happening
  const visibleAgents = Object.entries(agents).filter(
    ([, state]) => state.status === "running" || state.status === "done",
  ) as [AgentName, AgentState][];

  if (visibleAgents.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1.5">
      {visibleAgents.map(([name, state]) => (
        <AgentPanel key={name} name={name} state={state} />
      ))}
    </div>
  );
}
