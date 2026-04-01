"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { AGENT_ORDER } from "@/hooks/usePipeline";

// Page title map — keeps breadcrumb clean
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "generate",
  "/dashboard/history": "history",
  "/dashboard/credits": "credits",
  "/dashboard/transactions": "transactions",
};

interface TopBarProps {
  // pipeline state — only needed on /dashboard
  pipelineRunning?: boolean;
  pipelineDone?: boolean;
  agentStatuses?: Record<string, string>;
}

export function TopBar({
  pipelineRunning,
  pipelineDone,
  agentStatuses,
}: TopBarProps) {
  const pathname = usePathname();
  const pageLabel = PAGE_TITLES[pathname] ?? pathname.split("/").pop();

  const runningAgent = agentStatuses
    ? AGENT_ORDER.find((a) => agentStatuses[a] === "running")
    : null;

  return (
    <div className="h-11 shrink-0 border-b border-white/[0.04] flex items-center px-5 justify-between bg-[#09090b]">
      {/* Left: breadcrumb */}
      <span className="font-mono text-xs text-zinc-600">
        <span className="text-zinc-400">blogoAI</span>
        <span className="mx-2 text-zinc-700">/</span>
        <span className="text-zinc-500">{pageLabel}</span>
      </span>

      {/* Right: pipeline status + Clerk profile */}
      <div className="flex items-center gap-3">
        {pipelineRunning && runningAgent && (
          <span className="text-[10px] font-mono text-zinc-600">
            {runningAgent} running
          </span>
        )}
        {pipelineDone && (
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            complete
          </span>
        )}

        {/* Clerk's UserButton — handles profile, sign out etc */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
              userButtonPopoverCard:
                "bg-[#0a0a0f] border border-white/10 shadow-xl",
              userButtonPopoverActionButton:
                "text-white/70 hover:text-white hover:bg-white/5",
              userButtonPopoverActionButtonText: "text-sm",
              userButtonPopoverFooter: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
