"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AGENT_ORDER,
  AGENT_META,
  type AgentName,
  type AgentState,
} from "@/hooks/usePipeline";

interface AgentThinkingProps {
  agents: Record<AgentName, AgentState>;
}

// Single agent row with collapsible output
function AgentPanel({ name, state }: { name: AgentName; state: AgentState }) {
  const [open, setOpen] = useState(false);
  const meta = AGENT_META[name];

  const isRunning = state.status === "running";
  const isDone = state.status === "done";
  const isPending = state.status === "pending";

  // Only show toggle if done and has output data
  const hasOutput = isDone && state.output != null;

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300 overflow-hidden",
        isRunning
          ? "border-white/10 bg-white/[0.03]"
          : isPending
            ? "border-white/[0.04] bg-transparent"
            : "border-white/[0.06] bg-white/[0.02]",
      )}
    >
      {/* Shimmer line — active agent */}
      {isRunning && (
        <div
          className="h-[1px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${meta.color}80 50%, transparent 100%)`,
            animation: "shimmer 2s linear infinite",
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Header — always visible */}
      <button
        onClick={() => hasOutput && setOpen((o) => !o)}
        disabled={!hasOutput}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          hasOutput && "hover:bg-white/[0.02] cursor-pointer",
          !hasOutput && "cursor-default",
        )}
      >
        {/* Chevron — only if has output */}
        <span className="w-3 shrink-0">
          {hasOutput ? (
            open ? (
              <ChevronDown size={12} className="text-zinc-500" />
            ) : (
              <ChevronRight size={12} className="text-zinc-600" />
            )
          ) : null}
        </span>

        {/* Status indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isRunning && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
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
              borderColor: isPending ? "#27272a" : "transparent",
            }}
          />
        </span>

        {/* Icon box */}
        <span
          className="font-mono text-xs w-4 shrink-0"
          style={{
            color: isPending ? "#3f3f46" : meta.color,
          }}
        >
          {isRunning ? (
            <Loader2 size={12} className="animate-spin inline" />
          ) : (
            meta.icon
          )}
        </span>

        {/* Label */}
        <span
          className={cn(
            "text-xs font-medium flex-1",
            isPending ? "text-zinc-700" : "text-zinc-300",
          )}
        >
          {meta.label}
        </span>

        {/* Running description — like Claude's "Thinking..." */}
        {isRunning && (
          <span className="text-[10px] font-mono text-zinc-600 animate-pulse">
            {meta.desc}...
          </span>
        )}

        {/* Done badge */}
        {isDone && (
          <span className="text-[10px] font-mono text-emerald-500/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            done
          </span>
        )}
      </button>

      {/* Collapsible output — max height with scroll like Claude's thinking panel */}
      {open && hasOutput && (
        <div className="border-t border-white/5">
          <div
            className="overflow-y-auto px-4 py-3 max-h-[240px]"
            style={{ scrollbarWidth: "thin" }}
          >
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
  // Don't render if all agents are still pending
  const anyActive = AGENT_ORDER.some((a) => agents[a].status !== "pending");
  if (!anyActive) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1.5">
      {AGENT_ORDER.map((name) => (
        <AgentPanel key={name} name={name} state={agents[name]} />
      ))}
    </div>
  );
}
