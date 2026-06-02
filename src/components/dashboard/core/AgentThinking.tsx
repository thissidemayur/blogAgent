"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
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
          ? "border-white/[0.08] bg-white/[0.025]"
          : "border-white/[0.04] bg-transparent",
      )}
    >
      {/* Running shimmer */}
      {isRunning && (
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${meta.color}60, transparent)`,
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
          hasOutput
            ? "cursor-pointer hover:bg-white/[0.015]"
            : "cursor-default",
        )}
      >
        <span className="w-3 shrink-0 text-zinc-700">
          {hasOutput ? (
            open ? (
              <ChevronDown size={11} />
            ) : (
              <ChevronRight size={11} />
            )
          ) : (
            <span className="w-3" />
          )}
        </span>

        <span className="relative flex h-2 w-2 shrink-0">
          {isRunning && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
              style={{ backgroundColor: meta.color }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{
              backgroundColor: isDone
                ? "#10b981"
                : isRunning
                  ? meta.color
                  : "transparent",
              border: "1px solid #3f3f46",
            }}
          />
        </span>

        <span
          className="font-mono text-xs w-4 shrink-0"
          style={{ color: isDone ? "#71717a" : meta.color }}
        >
          {isRunning ? (
            <Loader2 size={11} className="animate-spin inline" />
          ) : (
            meta.icon
          )}
        </span>

        <span
          className={cn(
            "text-xs font-semibold flex-1 tracking-tight",
            isDone
              ? "text-zinc-500"
              : isRunning
                ? "text-zinc-200"
                : "text-zinc-700",
          )}
        >
          {meta.label}
        </span>

        {isRunning && (
          <span className="text-[10px] font-mono text-zinc-600 hidden sm:flex items-center gap-1.5 animate-pulse">
            {meta.desc}...
          </span>
        )}

        {isDone && (
          <span className="text-[9px] font-mono text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/15">
            done
          </span>
        )}
      </button>

      {open && hasOutput && (
        <div className="mx-3 mb-3 border-t border-white/[0.04] pt-2">
          <div
            className="overflow-y-auto max-h-52 rounded-lg bg-black/50 p-3"
            style={{ scrollbarWidth: "thin" }}
          >
            <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest block mb-2">
              agent_output
            </span>
            <pre className="text-[11px] font-mono text-zinc-500 whitespace-pre-wrap break-words leading-relaxed">
              {JSON.stringify(state.output, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function AgentThinking({ agents }: AgentThinkingProps) {
  const visible = Object.entries(agents).filter(
    ([, s]) => s.status === "running" || s.status === "done",
  ) as [AgentName, AgentState][];

  if (visible.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-1">
      {visible.map(([name, agentState]) => (
        <AgentPanel key={name} name={name} state={agentState} />
      ))}
    </div>
  );
}
